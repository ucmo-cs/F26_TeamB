import { CustomerLoanInfoContext } from '../contexts/CustomerLoanInfoContext';
import { Container, Button, Row, Col, FormSelect } from 'react-bootstrap';
import { useContext, useState, useEffect } from 'react';

export function SchedulePaymentComponent(){
    const {loanInfo, setLoanInfo, editMode, setEditMode} = useContext(CustomerLoanInfoContext);
    const [editPaymentAmount, setEditPaymentAmount] = useState(false);
    const [selectedPaymentAmount, setSelectedPaymentAmount] = useState('');
    const [selectedPaymentBy, setSelectedPaymentBy] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (loanInfo) {
            setSelectedPaymentBy(loanInfo.scheduledPaymentBy ?? '-');
            setSelectedPaymentAmount(loanInfo.scheduledPaymentAmount ?? '');
        }
        
    }, [loanInfo]);

    if (!loanInfo) return <Container className="my-4">Loading...</Container>;

    const editScheduledPaymentAPI = `http://localhost:8081/api/loans/${loanInfo.customerId}`;
    

    async function handleSave() {
        if (!selectedPaymentBy) {
            setError("Please select a payment frequency");
            return;
        }

        try {
        const response = await fetch(editScheduledPaymentAPI, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: loanInfo.firstName,
                lastName: loanInfo.lastName,
                scheduledPaymentBy: selectedPaymentBy
             })
        });

        if (response.ok) {
            setLoanInfo({ ...loanInfo, scheduledPaymentBy: selectedPaymentBy });
            setEditMode(false);
        }else{
            setError("Failed to update scheduled payment");
        }
        } catch (error) {
            setError("An error occurred while updating scheduled payment");
            console.error(error);
        }

    }

    return(
        <Container className='my-4'>
            {error && <p className="text-danger">{error}</p>}
            <Row className = 'mb-4'>
                <Col className='h2'>Scheduled Payment By</Col>

                {editMode? 
                <>
                <Col>
                <FormSelect value={selectedPaymentBy} onChange={(e) => setSelectedPaymentBy(e.target.value)}>
                    <option value="">Select payment frequency</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Weekly">Weekly</option>
                </FormSelect>
                </Col>

                <Col className='text-end'>
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                        <Button className = "mx-3" variant="secondary" onClick={() => {setEditMode(false); setError("");}}>Cancel</Button>
                </Col>
                </>
                : //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                <>
                <Col className='h2 text-end'>{loanInfo? loanInfo.paymentFrequency : '-'}</Col>

                <Col className='text-end'>
                        <Button variant="primary" onClick={() => setEditMode(true)}>Edit</Button>
                </Col>
                </>
                }
            </Row>

            <Row className='mb-4'>
            <Col className='h2'>Scheduled Payment Amount</Col>
            {editPaymentAmount? 
            <>
            
            </>
            :////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            <>
            <Col className='h2 text-end'>$ {loanInfo? loanInfo.scheduledPaymentAmount : '-'}</Col>
            </>

            }
            </Row>

            <Row className='mb-4'>
                <Col className='h2'>Minimum Payment</Col>
                <Col className='h2 text-end'>{loanInfo? loanInfo.minimumPayment : '-'}</Col>
            </Row>
        </Container>
    )
}