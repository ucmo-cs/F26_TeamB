import '../Custom.scss'
import '../App.css'
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap'; 
import { useContext, useEffect, useState } from 'react';
import { CustomerInfoContext } from '../contexts/CustomerInfoContext'; 
import { CustomerLoanInfoContext } from '../contexts/CustomerLoanInfoContext';
import { CustomerInfoModal } from './CustomerInfoModal';

/*
Requirments: 

In addition, any of the following data should be populated if it exists, and the customer should
be able to input or edit any of the following:
o The name of the customer.
o The customer’s email address.
o The customer’s phone number.
o The customer’s bank account details for automatic payments
*/

function InfoRow({ label, value, children }) {
    const hasValue = value !== undefined && value !== null && value !== '';
    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent px-0 py-3">
            <span className="text-muted">{label}</span>
            <span className="text-end">
                {children ?? (hasValue
                    ? <span className="fw-semibold">{value}</span>
                    : <span className="text-muted fst-italic">Not provided</span>)}
            </span>
        </ListGroup.Item>
    );
}
 
function SectionHeader({ title, subtitle, onEdit }) {
    return (
        <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
                <h2 className="h4 mb-1">{title}</h2>
                <div className="text-muted small">{subtitle}</div>
            </div>
            <Button variant="outline-primary" size="sm" onClick={onEdit}>
                Edit
            </Button>
        </div>
    );
}
 
const getInitials = (customerInfo) => {
    if (!customerInfo) return '?';
    const first = customerInfo.firstName?.[0] ?? '';
    const last = customerInfo.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || '?';
};
 
const maskAccountNumber = (accountNumber) =>
    accountNumber ? `•••• ${String(accountNumber).slice(-4)}` : null;
 
export function CustomerInfoComponent() {
 
    const { customerInfo } = useContext(CustomerInfoContext);
    const { customerLoanInfo } = useContext(CustomerLoanInfoContext);
    const [editCustomerInfo, setEditCustomerInfo] = useState(false);
    const [showAccountNumber, setShowAccountNumber] = useState(false);
 
    // Keep localStorage in sync after render instead of during it
    useEffect(() => {
        localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
        localStorage.setItem('customerLoanInfo', JSON.stringify(customerLoanInfo));
    }, [customerInfo, customerLoanInfo]);
 
    const fullName = customerInfo
        ? `${customerInfo.firstName ?? ''} ${customerInfo.lastName ?? ''}`.trim()
        : '';
 
    return (
        <Container className="pb-4">
            <Row className="g-4">
 
                {/* Personal information */}
                <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm border-0 rounded-4">
                        <Card.Body className="px-4">
                            <div className="d-flex align-items-center mb-3">
                                <div
                                    className="rounded-circle bg-primary text-white fw-semibold d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                    style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}
                                    aria-hidden="true"
                                >
                                    {getInitials(customerInfo)}
                                </div>
                                <div className="flex-grow-1">
                                    <div className="fw-semibold fs-5">{fullName || 'Your information'}</div>
                                    <div className="text-muted small">Contact details</div>
                                </div>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setEditCustomerInfo(true)}
                                >
                                    Edit
                                </Button>
                            </div>
 
                            <ListGroup variant="flush">
                                <InfoRow label="Name" value={fullName} />
                                <InfoRow label="Email address" value={customerInfo?.email} />
                                <InfoRow label="Phone number" value={customerInfo?.phoneNumber} />
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
 
                {/* Payment information */}
                <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm border-0 rounded-4">
                        <Card.Body className="px-4">
                            <SectionHeader
                                title="Payment information"
                                subtitle=""
                                onEdit={() => setEditCustomerInfo(true)}
                            />
 
                            <ListGroup variant="flush">
                                <InfoRow label="Bank nickname" value={customerInfo?.bankName} />
                                <InfoRow label="Routing number" value={customerInfo?.bankRoutingNumber} />
                                <InfoRow
                                    label="Account number"
                                    value={customerInfo?.bankAccountNumber}
                                >
                                    {customerInfo?.bankAccountNumber && (
                                        <>
                                            <span className="fw-semibold me-2">
                                                {showAccountNumber
                                                    ? customerInfo.bankAccountNumber
                                                    : maskAccountNumber(customerInfo.bankAccountNumber)}
                                            </span>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="p-0 text-decoration-none"
                                                onClick={() => setShowAccountNumber(!showAccountNumber)}
                                                aria-pressed={showAccountNumber}
                                            >
                                                {showAccountNumber ? 'Hide' : 'Show'}
                                            </Button>
                                        </>
                                    )}
                                </InfoRow>
                                <InfoRow
                                    label="Calculated pay-off date"
                                    value={customerLoanInfo?.loanEndDate}
                                />
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
 
            <CustomerInfoModal isEditable={editCustomerInfo} switchEditMode={setEditCustomerInfo} />
        </Container>
    );
}
