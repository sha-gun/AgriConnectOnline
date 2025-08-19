// src/pages/AdminOrders.jsx
import './AdminOrders.css';
import { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner, Badge, Modal, Row, Col, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL, fetchAllOrders, updateOrderStatus } from '../services/api';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetchAllOrders();
                if (response.data) {
                    setOrders(response.data);
                }
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setError(err.response?.data?.message || 'Failed to fetch orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const handleStatusUpdate = async (orderId, status) => {
        try {
            const response = await updateOrderStatus(orderId, { status: 'Delivered' });
            
            if (response.data) {
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, status: 'Delivered' } : order
                ));
                setMessage('Order status updated successfully');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update order status');
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="admin-orders-container"
        >
            <Container>
                <h2 className="admin-orders-title">Manage Orders</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <Spinner animation="border" role="status" className="loading-spinner">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                        <Table className="admin-orders-table" responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user.name}</td>
                                        <td>₹{order.totalPrice.toFixed(2)}</td>
                                        <td>
                                            <Badge bg={order.status === 'Delivered' ? 'success' : 'warning'} className="order-badge">
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button 
                                                variant="info" 
                                                size="sm" 
                                                className="view-btn me-2"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                <i className="fas fa-eye"></i> View
                                            </Button>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="deliver-btn"
                                                onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                                disabled={order.status === 'Delivered'}
                                            >
                                                Mark as Delivered
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Modal show={showModal} onHide={handleCloseModal} size="lg" className="order-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Order Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedOrder && (
                                    <div>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <div className="order-info-section">
                                                    <h5>Customer Information</h5>
                                                    <p><strong>Name:</strong> {selectedOrder.name}</p>
                                                    <p><strong>Address:</strong> {selectedOrder.address}</p>
                                                    <p><strong>City:</strong> {selectedOrder.city}</p>
                                                    <p><strong>Postal Code:</strong> {selectedOrder.postalCode}</p>
                                                    <p><strong>Country:</strong> {selectedOrder.country}</p>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="order-info-section">
                                                    <h5>Order Information</h5>
                                                    <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                                                    <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                                    <p><strong>Status:</strong> <Badge bg={selectedOrder.status === 'Delivered' ? 'success' : 'warning'} className="order-badge">{selectedOrder.status}</Badge></p>
                                                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                        <h5>Order Items</h5>
                                        <ListGroup className="order-items-list">
                                            {selectedOrder.items.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={6}>{item.product.name}</Col>
                                                        <Col md={3}>Quantity: {item.qty}</Col>
                                                        <Col md={3}>₹{(item.product.price * item.qty).toFixed(2)}</Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                        <div className="order-total">
                                            <Row className="text-end">
                                                <Col>
                                                    <h5>Shipping Fee: ₹{selectedOrder.shippingFee.toFixed(2)}</h5>
                                                    <h4>Total Amount: ₹{selectedOrder.totalPrice.toFixed(2)}</h4>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                                {selectedOrder && selectedOrder.status !== 'Delivered' && (
                                    <Button 
                                        variant="success"
                                        className="deliver-btn"
                                        onClick={() => {
                                            handleStatusUpdate(selectedOrder._id, 'Delivered');
                                            handleCloseModal();
                                        }}
                                    >
                                        Mark as Delivered
                                    </Button>
                                )}
                            </Modal.Footer>
                        </Modal>
                    </>
                )}
            </Container>
        </motion.div>
    );
}

export default AdminOrders;
