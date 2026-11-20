import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import {ChangePassModal} from './ChangePassModal';

export function CustomerNavBar(){
    const {logout} = useAuth();
    const navigate = useNavigate();
    const [changePass, setChangePass] = useState(false);
    
    function handleLogout() {
        logout();
        navigate('/');

    }
    
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>Loan Repayment Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as = {Link} to="/customer">Home</Nav.Link>
                        <Nav.Link as = {Link} to="/customer/schedule-payment">Schedule Payments</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link className = "Navbar-right" onClick = {() => setChangePass(true)}>Change Password</Nav.Link>
                        <Nav.Link className = "Navbar-right" onClick = {handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <ChangePassModal show={changePass} handleClose={() => setChangePass(false)} />
            </Container>
        </Navbar>
    );
}