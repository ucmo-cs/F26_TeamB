import '../Custom.scss'
import '../App.css'
import { Container, Row, Col } from 'react-bootstrap'; 
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


export function LoanComponent(){
    const { customerLoanInfo } = useContext(CustomerLoanInfoContext);

    return(
        <Container className="my-5 bg-secondary rounded">
            <Row className = 'mb-4'>
                <Col className='h2'>Amount Owed</Col>
                <Col className='h2 text-end'>$ {customerLoanInfo? customerLoanInfo.remainingBalance : '-'}</Col>
            </Row>
            <Row>
                <Col className='h5'>Date Taken Out</Col>
                <Col className='h5 text-end'>{customerLoanInfo? customerLoanInfo.loanDate : '-'}</Col>
            </Row>
            <Row>
                <Col className='h5'>Original Amount</Col>
                <Col className='h5 text-end'>${customerLoanInfo? customerLoanInfo.originalAmount : '-'}</Col>
            </Row>
            <Row>
                <Col className='h5'>Interest Rate</Col>
                <Col className='h5 text-end'>{customerLoanInfo? customerLoanInfo.interestRate * 100 : '-'} %</Col>
            </Row>
            <Row>
                <Col className='h5'>Calculated pay-off Date</Col>
                <Col className='h5 text-end'>{customerLoanInfo? customerLoanInfo.calculatedPayoffDate : '-'}</Col>
            </Row>
            <Row>
                <Col className='h5'>Minimum monthly payment</Col>
                <Col className='h5 text-end'>{customerLoanInfo? customerLoanInfo.minimumMonthlyPayment : '-'}</Col>
            </Row>
        </Container>
    )
}