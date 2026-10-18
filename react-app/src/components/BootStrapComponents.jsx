// import React from 'react'
import '../Custom.scss'
import '../App.css'
import { Container, Button, Nav, Navbar, Form, Alert } from 'react-bootstrap'; 
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function NaviBar() {
  // 2. Return the pre-styled React components
  return (

    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="mt-3">
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/personal">Personal</Nav.Link> 
            <Nav.Link as={Link} to="/wealth">Wealth</Nav.Link>
            <Nav.Link as={Link} to="/business">Business</Nav.Link>
            <Nav.Link as={Link} to="/corporate">Corporate</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
  );
}

function LoginComponent(){
  const navigate = useNavigate();
  const { login } = useAuth();

  const[userName, setUsername] = useState('');  
  const[password, setPassword] = useState('');
  const[error, setError] = useState('');  

  const LogIn_API = 'http://localhost:8081/api/login';

  async function validateLogin(userName, Password){
    const response = await fetch(LogIn_API,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({
          userName: userName,
          password: Password
        }),
      });
      
      if (!response.ok){
        throw new Error("Invalid username or password");
      }

      return response.json();
    }

    async function handleSubmit(e){
      e.preventDefault();
      setError('');

      try {
        const credentials = await validateLogin(userName, password);
        if (credentials) {
          login(credentials); // Update the context with the logged-in user
          navigate(credentials.role === "admin" ? "/admin" : "/customer");
        }
        else {
          setError("Invalid username or password");
        }
      }

      catch (error) {setError(error.message)}

    }


  

  return (
      <div className="container d-flex align-items-center min-vh-100">
        <div className="row justify-content-center w-100">
          <div className="col-12 col-md-8 col-lg-5 col-xl-5">
  
            <Form onSubmit={handleSubmit} className="card border-0 shadow rounded-4 p-4 p-md-5">
  
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Log in</h2>
                <p className="text-body-secondary mb-0">Sign in to manage your loans.</p>
              </div>
  
              {error && (
              <Alert variant='danger' className="py-2 mb-4" role="alert">
                <p className="mb-0 small">{error}</p>
              </Alert>)}
  
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label className="fw-semibold small">Username</Form.Label>
                <Form.Control size="lg" type="text" placeholder="Enter username" autoComplete="username" value={userName} onChange={(e) => setUsername(e.target.value)}/>
              </Form.Group>
  
              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label className="fw-semibold small">Password</Form.Label>
                <Form.Control size="lg" type="password" placeholder="Password" autoComplete="current-password" value = {password} onChange={(e) => setPassword(e.target.value)}/>
              </Form.Group>
  
              <div className="d-grid">
                <Button variant="primary" size="lg" type="submit" className="fw-semibold">
                  Log in
                </Button>
              </div>
  
            </Form>
  
          </div>
        </div>
      </div>

  )
}

function LoanTable({ loans }) {
  return (
    <div className="table-responsive rounded border bg-white shadow-sm">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead className="table-light text-uppercase small text-secondary">
          <tr>
            <th scope="col" className="px-4 py-3 text-nowrap">Customer Name</th>
            <th scope="col" className="px-4 py-3 text-nowrap">Loan Start Date</th>
            <th scope="col" className="px-4 py-3 text-nowrap">Principal Amount</th>
            <th scope="col" className="px-4 py-3 text-nowrap">Balance Remaining</th>
            <th scope="col" className="px-4 py-3 text-nowrap">Interest Rate</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className="px-4 py-3">
                <Link to={`/admin/detailed/${loan.id}`} className="fw-medium text-decoration-none">
                {/* If customer info is not found, display "Customer not found" */}
                  {loan.customerFirstName && loan.customerLastName
                    ? `${loan.customerFirstName} ${loan.customerLastName}`
                    : loan.customerId ? "Customer not found" : "No customer associated"}
                </Link>
              </td>
              <td className="px-4 py-3">{loan.loanDate}</td>
              <td className="px-4 py-3">{loan.originalAmount.toLocaleString({ style: 'currency', currency: 'USD' })}</td>
              <td className="px-4 py-3">{loan.remainingBalance.toLocaleString({ style: 'currency', currency: 'USD' })}</td>
              <td className="px-4 py-3">{loan.interestRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export {NaviBar, LoginComponent, LoanTable};