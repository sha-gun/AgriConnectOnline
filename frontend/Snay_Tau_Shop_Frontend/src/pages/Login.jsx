// src/pages/Login.jsx

import './Auth.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { API_URL } from '../services/api';
import Lottie from 'lottie-react';
import loginAnimation from '../assets/lottie/login.json';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple Validation
        if (!email || !password) {
            setError('Please fill in both email and password fields.');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const { token } = res.data;
            localStorage.setItem('token', token);

            // Get user role from token
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === 'admin') {
                window.location.href = '/admin/products';
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Container>
                <Row className="justify-content-center align-items-center">
                    <Col md={6} className="d-none d-md-block">
                        <div className="auth-animation">
                            <Lottie 
                                animationData={loginAnimation}
                                loop={true}
                                className="lottie-animation"
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="auth-box">
                            <h3 className="auth-title">Welcome Back</h3>
                            {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}

                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                    />
                                </Form.Group>

                                <Button className="auth-btn w-100" type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                className="auth-spinner"
                                            />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </Form>

                            <p className="redirect-text">
                                Don{'&apos'}t have an account?{' '}
                                <a href="/signup" className="auth-link">
                                    Sign Up
                                </a>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;