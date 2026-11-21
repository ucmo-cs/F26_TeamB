// modal to change password
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

export function ChangePassModal({ show, handleClose }) {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const API_URL = `http://localhost:8081/api/customer/change-password/${user.id}`;
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (currentPassword !== user.password) {
            setError('Current password is incorrect.');
            return;
        }
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (!response.ok) {
                throw new Error('Failed to change password.');
            }

            setError('');

            Alert('Password changed successfully. Please log in again.');
            handleClose();
        } catch (err) {
            setError('Failed to change password. Please check your current password and try again.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="text-danger">{error}</p>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formCurrentPassword">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="string"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formNewPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formConfirmNewPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Change Password
                    </Button>
                </Form>
            </Modal.Body>   
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>   
            </Modal.Footer>
        </Modal>
    );
}