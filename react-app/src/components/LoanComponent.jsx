import '../Custom.scss'
import '../App.css'
import { Card, ListGroup, ProgressBar, Container, Row, Col, Button, Collapse } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { CustomerLoanInfoContext } from '../contexts/CustomerLoanInfoContext';

/*
Requirments: 

After logging in a customer should be taken to a page dedicated to their loan where they see the
following:
o The date their loan was taken out.   
o The amount of the loan that they still owe.
o The original amount of the loan.
o The loan’s interest rate.
o A calculated pay-off date if automatic payments have been set up.
o A minimum monthly payment, calculated using the Standard Amortization Formula.
*/

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const toCurrency = (value) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function DetailRow({ label, value }) {
    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent px-0 py-3">
            <span className="text-muted">{label}</span>
            <span className="fw-semibold text-end">{value}</span>
        </ListGroup.Item>
    );
}

export function LoanComponent() {
    const { customerLoanInfo } = useContext(CustomerLoanInfoContext);
    const [openDetails, setOpenDetails] = useState(false);
    const paidPercent = customerLoanInfo
        ? Math.round(
              ((customerLoanInfo.originalAmount - customerLoanInfo.remainingBalance) /
                  customerLoanInfo.originalAmount) * 100
          )
        : 0;

    return (
        <Container className="py-4">
        <Card className="h-100 shadow-sm border-0 rounded-4">
            <Card.Body className="px-4">
                
                <div className="mb-4">
                    <div className="text-muted small">Amount Owed</div>
                    <div className="display-6 fw-bold">
                        {customerLoanInfo ? toCurrency(customerLoanInfo.remainingBalance) : '-'}
                    </div>
                    <ProgressBar
                        now={paidPercent}
                        variant="success"
                        className="mt-3"
                        style={{ height: '20px' }}
                        aria-label="Loan paid off"
                    />
                    <Row className="mb-3">
                        <Col xs={6}>
                            <span className="text-muted small me-2">Paid Off:</span>
                            <span className="fw-semibold">
                                {customerLoanInfo ? toCurrency(customerLoanInfo.originalAmount - customerLoanInfo.remainingBalance) : '-'}
                            </span>
                        </Col>
                        <Col xs={6}>
                            <div className="text-end">
                            <span className="text-muted small me-2 text">Remaining:</span>
                            <span className="fw-semibold">
                                {customerLoanInfo ? toCurrency(customerLoanInfo.remainingBalance) : '-'}
                            </span>
                            </div>
                        </Col>
                    </Row>
                </div>

                <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    onClick={() => setOpenDetails(!openDetails)}
                    aria-controls="loan-details"
                    aria-expanded={openDetails}
                >
                    {openDetails ? 'Hide details ▲' : 'Show details ▼'}
                </Button>


                <Collapse in={openDetails}>
                <ListGroup variant="flush">
                    <DetailRow
                        label="Date Taken Out"
                        value={customerLoanInfo ? formatDate(customerLoanInfo.loanDate) : '-'}
                    />
                    <DetailRow
                        label="Original Amount"
                        value={customerLoanInfo ? toCurrency(customerLoanInfo.originalAmount) : '-'}
                    />
                    <DetailRow
                        label="Interest Rate"
                        value={`${customerLoanInfo ? customerLoanInfo.interestRate : '-'} %`}
                    />
                    <DetailRow
                        label="Pay-off Date"
                        value={customerLoanInfo ? formatDate(customerLoanInfo.loanEndDate) : '-'}
                    />
                    <DetailRow
                        label="Minimum Monthly Payment"
                        value={customerLoanInfo ? toCurrency(customerLoanInfo.minimumScheduledPaymentAmount) : '-'}
                    />
                </ListGroup>
                </Collapse>
            </Card.Body>
        </Card>
        </Container>
    );
}