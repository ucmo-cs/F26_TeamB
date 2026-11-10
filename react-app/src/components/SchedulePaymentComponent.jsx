import { useContext } from 'react';
import { Container, Card, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { CustomerLoanInfoContext } from '../contexts/CustomerLoanInfoContext';

const toCurrency = (value) =>
    value === undefined || value === null || value === ''
        ? '-'
        : Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function parseDate(value) {
    if (!value) return null;
    const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function StatTile({ label, value }) {
    return (
        <Card className="h-100 shadow-sm border-0 rounded-4">
            <Card.Body className="px-4 py-3">
                <div className="text-muted small mb-1">{label}</div>
                <div className="fs-4 fw-bold">{value}</div>
            </Card.Body>
        </Card>
    );
}

export function SchedulePaymentComponent() {
    const { loanInfo, setEditMode } = useContext(CustomerLoanInfoContext);

    if (!loanInfo) {
        return (
            <Container className="py-5 text-center text-muted">
                <Spinner animation="border" size="sm" className="me-2" />
                Loading your payment schedule…
            </Container>
        );
    }

    const { paymentFrequency, scheduledPaymentAmount, minimumScheduledPaymentAmount: minimum } = loanInfo;
    const hasSchedule = Boolean(paymentFrequency) && scheduledPaymentAmount != null;
    const aboveMinimum =
        hasSchedule && minimum != null ? Math.max(scheduledPaymentAmount - minimum, 0) : null;
    const payoffDate = parseDate(loanInfo.loanEndDate);

    return (
        <Container className="py-4">
            {/* Hero */}
            <Card className="border-0 rounded-4 shadow-sm bg-primary text-white mb-4">
                <Card.Body className="px-4 px-md-5 ">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <div className="text-uppercase small opacity-75 mb-2" style={{ letterSpacing: '0.08em' }}>
                                Your payment schedule
                            </div>
                            {hasSchedule ? (
                                <>
                                    <div className="display-4 fw-bold lh-1">{toCurrency(scheduledPaymentAmount)}</div>
                                    <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
                                        <Badge bg="light" text="primary" className="rounded-pill px-4 py-2 fw-semibold fs-6">
                                            {paymentFrequency}
                                        </Badge>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="h2 fw-bold mb-1">No schedule yet</div>
                                    <div className="opacity-75">Choose how often and how much you’d like to pay.</div>
                                </>
                            )}
                        </div>
                        <Button variant="light" className="fw-semibold text-primary" onClick={() => setEditMode(true)}>
                            {hasSchedule ? 'Edit schedule' : 'Set up schedule'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Stat tiles */}
            <Row className="g-3 mb-4">
                <Col xs={12} md={4}>
                    <StatTile
                        label="Minimum payment"
                        value={toCurrency(minimum)}
                    />
                </Col>
                <Col xs={12} md={4}>
                    <StatTile
                        label="Above minimum"
                        value={aboveMinimum != null ? toCurrency(aboveMinimum) : '-'}
                    />
                </Col>
                <Col xs={12} md={4}>
                    <StatTile
                        label="Estimated pay off Date"
                        value={payoffDate ? payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                    />
                </Col>
            </Row>

            
        </Container>
    );
}