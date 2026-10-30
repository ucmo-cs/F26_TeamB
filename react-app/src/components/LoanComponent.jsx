import '../Custom.scss'
import '../App.css'
import { Card, ListGroup, ProgressBar, Container  } from 'react-bootstrap'; 
import { useContext } from 'react';
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
                        style={{ height: '8px' }}
                        aria-label="Loan paid off"
                    />
                    <div className="text-muted small mt-1">{paidPercent}% paid off</div>
                </div>

                <ListGroup variant="flush">
                    <DetailRow
                        label="Date Taken Out"
                        value={customerLoanInfo ? customerLoanInfo.loanDate : '-'}
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
                        value={customerLoanInfo ? customerLoanInfo.loanEndDate : '-'}
                    />
                    <DetailRow
                        label="Minimum Monthly Payment"
                        value={customerLoanInfo ? toCurrency(customerLoanInfo.minimumScheduledPaymentAmount) : '-'}
                    />
                </ListGroup>
            </Card.Body>
        </Card>
        </Container>
    );
}