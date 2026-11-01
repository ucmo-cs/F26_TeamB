import { Modal, Form, Button } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { CustomerInfoContext } from '../contexts/CustomerInfoContext';

export function CustomerPaymentModal({isEditable, switchEditMode}){
    const {customerInfo, setCustomerInfo} = useContext(CustomerInfoContext);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        setError('');
        try {
            const response = await fetch(`http://localhost:8081/api/customer/${customerInfo.id}`, { 
                method: 'PATCH',                                           
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...customerInfo, ...formData }),
            });
            if (!response.ok) throw new Error('Failed to save your changes.');
            setCustomerInfo((prev) => ({ ...prev, ...formData }));
            switchEditMode(false);
        } catch (err) {
            setError(err.message);
        }
    }



    return (
        
        <Modal show={isEditable} onHide={() => { setError(''); switchEditMode(false); }}>
            <Modal.Header>
                <Modal.Title>Edit Customer Payment Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="text-danger">{error}</p>}
                <Form id = "customerPaymentInfoForm" onSubmit = {handleSubmit}>
                    <Form.Group className="mb-3" controlId="formPaymentNickname">
                        <Form.Label>Bank Name</Form.Label>
                        <Form.Control type="text" name="bankName" defaultValue={customerInfo? customerInfo.bankName : ''} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRoutingNumber">
                        <Form.Label>Bank Routing Number</Form.Label>
                        <Form.Control type="text" name="bankRoutingNumber" defaultValue={customerInfo? customerInfo.bankRoutingNumber : ''} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formAccountNumber">
                        <Form.Label>Bank Account Number</Form.Label>
                        <Form.Control type="text" name="bankAccountNumber" defaultValue={customerInfo? customerInfo.bankAccountNumber : ''} required/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick = {() => { setError(''); switchEditMode(false); }}>Close</Button>
                <Button variant="primary" type = "submit" form = "customerPaymentInfoForm">Save changes</Button>
            </Modal.Footer>
        </Modal>
    )
}

