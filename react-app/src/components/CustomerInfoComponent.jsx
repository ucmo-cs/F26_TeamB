import '../Custom.scss'
import '../App.css'
import { Container, Row, Col, Button } from 'react-bootstrap'; 
import { useContext, useState } from 'react';
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

export function CustomerInfoComponent(){
    
    const {customerInfo} = useContext(CustomerInfoContext);
    const {customerLoanInfo} = useContext(CustomerLoanInfoContext);
    const [editCustomerInfo, setEditCustomerInfo] = useState(false);

    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    localStorage.setItem('customerLoanInfo', JSON.stringify(customerLoanInfo));


    return(
        
        <Container>
            <Row className = 'mb-4'>
                <Col className='h2'>Your Information</Col>
            </Row>
            <Row>
                <Col className='p fs-4'>Name</Col>
                <Col className='p fs-5 text-end'>{customerInfo? `${customerInfo.firstName} ${customerInfo.lastName}` : '-'}</Col>
            </Row>
            <Row>
                <Col className='p fs-4'>Email Address</Col>
                <Col className='p fs-5 text-end'>{customerInfo? customerInfo.email : '-'}</Col>
            </Row>
            <Row>
                <Col className='p fs-4'>Phone Number</Col>
                <Col className='p fs-5 text-end'>{customerInfo? customerInfo.phoneNumber : '-'}</Col>
            </Row>
            <Row>
                <Col className='p fs-4'>Calculated pay-off Date</Col>
                <Col className='p fs-5 text-end'>{customerLoanInfo? customerLoanInfo.loanEndDate : '-'}</Col>
            </Row>

            
            <Row className = 'mb-4 mt-5'>
                <Col className='h2'>Payment Information</Col>
            </Row>
            <Row>
                <Col className='p fs-4'>Bank Nickname</Col>
                <Col className='p fs-5 text-end'>{customerInfo? customerInfo.bankName : '-'}</Col>
            </Row>
            <Row>
                <Col className='p fs-4'>Routing Number</Col>
                <Col className='p fs-5 text-end'>{customerInfo? customerInfo.bankRoutingNumber : '-'}</Col>
            </Row>
            <Row>
                <Col className='p fs-4'>Account Number</Col>
                <Col className='p fs-5 text-end'>{customerInfo? customerInfo.bankAccountNumber : '-'}</Col>
            </Row>

            <Button className = 'my-4' variant="primary" onClick={() => setEditCustomerInfo(true)}>Edit Information</Button>
            <CustomerInfoModal isEditable = {editCustomerInfo} switchEditMode = {setEditCustomerInfo}/>
        </Container>
        
    )
}