import { Navbar, Container, Nav, Button} from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';


export default function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true }); 
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <NavLink to="/admin" className="navbar-brand">Loan Repayment Tracker</NavLink>
                    <Nav className="me-auto">
                        <NavLink to="/admin" end className="nav-link">Dashboard</NavLink>
                        <NavLink to="/admin/create-loan" className="nav-link">Create New Loan</NavLink>
                    </Nav>
                    <Button variant="outline-secondary" size="sm" onClick={handleLogout}>Logout</Button>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Outlet />
            </Container>
        </>
    )
}

