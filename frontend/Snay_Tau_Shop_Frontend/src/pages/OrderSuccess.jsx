import { useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './OrderSuccess.css';

function OrderSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to orders page after 3 seconds
        const timer = setTimeout(() => {
            navigate('/orders');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-success-container"
        >
            <Container className="text-center py-5">
                <div className="success-icon mb-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        ✅
                    </motion.div>
                </div>
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                >
                    Order Placed Successfully!
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Alert variant="success" className="mx-auto" style={{ maxWidth: '600px' }}>
                        Thank you for your purchase! Your order has been received and is being processed.
                        You will be redirected to your orders page in a few seconds...
                    </Alert>
                </motion.div>
            </Container>
        </motion.div>
    );
}

export default OrderSuccess; 