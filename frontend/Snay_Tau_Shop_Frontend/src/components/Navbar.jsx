import { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Navbar.css'; // Import external CSS file for responsive styles


function AppNavbar() {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    return (
        <motion.nav
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
            <Navbar
                expand="lg"
                fixed="top"
                className="app-navbar shadow-sm"
            >
                <Container>
                    {/* Brand Logo */}
                    <Navbar.Brand
                        as={NavLink}
                        to="/"
                        className="navbar-brand fw-bold d-flex align-items-center"
                    >
                        <span role="img" aria-label="logo" className="brand-emoji me-2">
                            🚜
                        </span>
                        Kisaan Krishi Seva Kendra
                    </Navbar.Brand>

                    {/* Navbar Toggle */}
                    <Navbar.Toggle aria-controls="navbar-content" />

                    {/* Navbar Links */}
                    <Navbar.Collapse id="navbar-content">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link as={NavLink} to="/" end className="nav-link-item">
                                Home
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/products" className="nav-link-item">
                                Products
                            </Nav.Link>

                            {isAuthenticated && (
                                <>
                                    <Nav.Link as={NavLink} to="/cart" className="nav-link-item">
                                        Cart
                                    </Nav.Link>
                                    <Nav.Link as={NavLink} to="/orders" className="nav-link-item">
                                        Orders
                                    </Nav.Link>
                                    <Nav.Link as={NavLink} to="/support" className="nav-link-item">
                                        Support
                                    </Nav.Link>
                                </>
                            )}

                            {/* Admin Space */}
                            {isAdmin && (
                                <NavDropdown 
                                    title={
                                        <span className="fw-medium text-primary">
                                            👑 Admin Space
                                        </span>
                                    }
                                    id="admin-nav-dropdown"
                                    className="mx-2"
                                >
                                    <NavDropdown.Item as={NavLink} to="/admin/dashboard">
                                        Dashboard
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/admin/products">
                                        Manage Products
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/admin/orders">
                                        Manage Orders
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/admin/users">
                                        Manage Users
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

                            

                            {!isAuthenticated ? (
                                <>
                                    <Button
                                        as={NavLink}
                                        to="/login"
                                        variant="outline-primary"
                                        className="nav-btn mx-2"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        as={NavLink}
                                        to="/signup"
                                        variant="primary"
                                        className="nav-btn mx-2"
                                    >
                                        Signup
                                    </Button>
                                </>
                            ) : (
                                <NavDropdown
                                    title={
                                        <span className="fw-medium text-secondary">
                                            👤 {user?.name || 'User'}
                                        </span>
                                    }
                                    id="user-nav-dropdown"
                                    align="end"
                                    className="mx-2"
                                >
                                    <NavDropdown.Item
                                        as="button"
                                        onClick={handleLogout}
                                        className="text-danger"
                                    >
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </motion.nav>
    );
}

export default AppNavbar;
