/*
modal for sending a email to reset get username and password
*/

import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export function ForgotPasswordModal({ show, handleClose }) {
  const [email, setEmail] = useState('');
const ForgotPassword_API = 'http://localhost:8081/api/forgot-password';


    const handleSubmit = (e) => {
    e.preventDefault();
    // Send the email to the backend for processing
    fetch(ForgotPassword_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setEmail('');

  }

    return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>
        </Modal.Body>
    </Modal>
  );
}