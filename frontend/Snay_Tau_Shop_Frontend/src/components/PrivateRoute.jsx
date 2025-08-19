// src/components/PrivateRoute.jsx

import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading, error } = useContext(AuthContext);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Alert variant="warning" className="m-3 text-center">
                    {error || 'You must be logged in to access this page.'}
                </Alert>
                <Navigate to="/login" replace />
            </motion.div>
        );
    }

    return children;
};

// ✅ Prop validation
PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
