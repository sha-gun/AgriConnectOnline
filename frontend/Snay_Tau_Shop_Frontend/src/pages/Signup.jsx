// src/pages/Signup.jsx

import './Auth.css';
import { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api';
import Lottie from 'lottie-react';
import signupAnimation from '../assets/lottie/signup.json';

function Signup() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to signup');
            }

            const text = await response.text();
            if (!text) {
                throw new Error('Empty response from server');
            }
            const data = JSON.parse(text);
            login(data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="auth-container"
        >
            <Container>
                <Row className="justify-content-center align-items-center">
                    <Col md={6} className="d-none d-md-block">
                        <div className="auth-animation">
                            <Lottie 
                                animationData={signupAnimation}
                                loop={true}
                                className="lottie-animation"
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="auth-box">
                            <h3 className="auth-title">Create Account</h3>
                            <p className="auth-subtitle">Join our community today!</p>
                            
                            {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}
                            
                            <Form onSubmit={handleSubmit} className="signup-form">
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="auth-input"
                                    />
                                </Form.Group>

                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="auth-input"
                                    />
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="auth-input"
                                    />
                                    <Form.Text className="password-hint">
                                        Password must be at least 8 characters long
                                    </Form.Text>
                                </Form.Group>

                                <Button 
                                    className="auth-btn w-100" 
                                    type="submit" 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </Button>
                            </Form>

                            <div className="auth-separator">
                                <span>or</span>
                            </div>

                            <p className="redirect-text">
                                Already have an account? {' '}
                                <Link to="/login" className="auth-link">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
}

export default Signup;