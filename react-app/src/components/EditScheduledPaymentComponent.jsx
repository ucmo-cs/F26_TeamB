import { useState, useContext } from 'react';
import { CustomerLoanInfoContext } from '../contexts/CustomerLoanInfoContext';
import { Card, Button, Form, InputGroup, ToggleButton, ToggleButtonGroup, Alert, Container } from 'react-bootstrap';

const toCurrency = (value) =>
    value === undefined || value === null || value === ''
        ? '-'
        : Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const FREQUENCIES = [
    { value: 'Monthly', hint: 'Recurs on the same date every month.', perYear: 12 },
    { value: 'Bi-weekly', hint: 'Recurs on the same day of the week every two weeks.', perYear: 26 },
    { value: 'Weekly', hint: 'Recurs on the same day of the week every week.', perYear: 52 },
];

function monthlyPayment(originalAmount, paidAmount, endDate, interestRatePercent) {
  const principal = originalAmount - paidAmount;
  if (principal <= 0) return 0;

  const end = Date.parse(endDate);
  if (Number.isNaN(end)) throw new Error("Invalid end date");

  const n = 12;
  const years = (end - Date.now()) / (1000 * 60 * 60 * 24 * 365.25);
  if (years <= 0) return principal; // already due

  const periods = n * years;
  const r = interestRatePercent / 100 / n;

  const payment = r === 0
    ? principal / periods
    : (principal * r * Math.pow(1 + r, periods)) / (Math.pow(1 + r, periods) - 1);

  return Math.round(payment * 100) / 100;
}

export function EditScheduledPaymentComponent() {
    const { loanInfo, setLoanInfo, setEditMode } = useContext(CustomerLoanInfoContext);
    // This component only mounts in edit mode, so initial state always starts from the saved loan.
    const [paymentBy, setPaymentBy] = useState(loanInfo.paymentFrequency ?? '');
    const [paymentAmount, setPaymentAmount] = useState(loanInfo.scheduledPaymentAmount ?? '');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const [minimum, setMinimum] = useState(loanInfo.minimumScheduledPaymentAmount);
    const parsedAmount = parseFloat(paymentAmount);
    const amountInvalid =
        paymentAmount === '' ||
        !Number.isFinite(parsedAmount) ||
        parsedAmount <= 0 ||
        (minimum !== undefined && minimum !== null && parsedAmount < minimum);

    const activeFrequency = FREQUENCIES.find((f) => f.value === paymentBy);
    const editScheduledPaymentAPI = `http://localhost:8081/api/loans/${loanInfo.customerId}`;

    async function handleSave() {
        if (!paymentBy) {
            setError('Choose how often you want to pay.');
            return;
        }
        if (amountInvalid) {
            setError(`Enter an amount of at least ${toCurrency(minimum)}.`);
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(editScheduledPaymentAPI, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentFrequency: paymentBy,
                    scheduledPaymentAmount: parsedAmount,
                }),
            });

            if (response.ok) {
                const updatedLoanInfo = await response.json();
                setLoanInfo(updatedLoanInfo); // without this the view keeps showing the old schedule
                setEditMode(false);
            } else {
                setError('We couldn’t save your schedule. Please try again.');
                setSaving(false);
            }
        } catch (err) {
            setError('Something went wrong while saving. Check your connection and try again.');
            console.error(err);
            setSaving(false);
        }
    }

    const handleFrequencyChange = (frequency) => {
        setPaymentBy(frequency); // this was missing
        setError('');

        const divisors = { 'Monthly': 1, 'Bi-weekly': 2, 'Weekly': 4 };
        const divisor = divisors[frequency];
        if (!divisor) return;

        let monthlyAmount;
        try {
            monthlyAmount = monthlyPayment(
                loanInfo.originalAmount,
                loanInfo.paidAmount,
                loanInfo.endDate,
                loanInfo.interestRatePercent
            );
        } catch (err) {
            console.error(err);
            return; // keep the current minimum
        }

        // Round UP to the cent so the minimum is always payable
        const newMinimum = Math.ceil((monthlyAmount / divisor) * 100) / 100;
        setMinimum(newMinimum);

        // bump the amount if it's now below the minimum
        if (!Number.isFinite(parsedAmount) || parsedAmount < newMinimum) {
            setPaymentAmount(newMinimum.toFixed(2));
        }
    };

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="px-4 py-4">
                    <div className="mb-3">
                        <h1 className="h3 mb-1">Edit payment schedule</h1>
                    </div>

                    {error && (
                        <Alert variant="danger" className="py-2 small" role="alert">
                            {error}
                        </Alert>
                    )}

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Frequency</Form.Label>
                        <div>
                            <ToggleButtonGroup
                                type="radio"
                                name="paymentFrequency"
                                value={paymentBy}
                                onChange={handleFrequencyChange}
                                className="w-100"
                            >
                                {FREQUENCIES.map((f) => (
                                    <ToggleButton key={f.value} id={`freq-${f.value}`} value={f.value} variant="outline-primary">
                                        {f.value}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="scheduledPaymentAmount">
                        <Form.Label className="fw-semibold">Payment amount</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                                type="number"
                                inputMode="decimal"
                                min={minimum ?? 0}
                                step="0.01"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                isInvalid={paymentAmount !== '' && amountInvalid}
                                aria-describedby="minimumHelp"
                            />
                            <Form.Control.Feedback type="invalid">
                                Must be at least {toCurrency(minimum)}.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text id="minimumHelp" className="text-muted">
                            Minimum payment: {toCurrency(minimum)}
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save schedule'}
                        </Button>
                        <Button variant="outline-secondary" onClick={() => setEditMode(false)} disabled={saving}>
                            Cancel
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}