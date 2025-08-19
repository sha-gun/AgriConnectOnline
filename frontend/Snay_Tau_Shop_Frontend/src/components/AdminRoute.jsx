// src/components/AdminRoute.jsx

import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';

const AdminRoute = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoading: true,
        isAuthenticated: false,
        error: null,
    });

    useEffect(() => {
        const verifyToken = () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    error: 'No token found. Please login.',
                });
                return;
            }

            try {
                const decoded = jwtDecode(token);

                // Check if the user role is 'admin'
                if (decoded.role !== 'admin') {
                    setAuthState({
                        isLoading: false,
                        isAuthenticated: false,
                        error: 'Access denied. Admins only.',
                    });
                    return;
                }

                // Check if the token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setAuthState({
                        isLoading: false,
                        isAuthenticated: false,
                        error: 'Session expired. Please login again.',
                    });
                    return;
                }

                // If all checks pass
                setAuthState({
                    isLoading: false,
                    isAuthenticated: true,
                    error: null,
                });
            } catch (error) {
                console.error('Invalid token:', error.message);
                localStorage.removeItem('token');
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    error: 'Invalid token. Please login again.',
                });
            }
        };

        verifyToken();
    }, []);

    if (authState.isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!authState.isAuthenticated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Alert variant="danger" className="m-3">
                    {authState.error}
                </Alert>
                <Navigate to="/login" replace />
            </motion.div>
        );
    }

    return children;
};

// ✅ Prop validation
AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminRoute;
