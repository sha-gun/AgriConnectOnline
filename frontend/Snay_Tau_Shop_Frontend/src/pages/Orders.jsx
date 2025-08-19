import { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Badge, Button, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';
import Footer from '../components/Footer';
import './Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${API_URL}/orders/myorders`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch your orders');
                }

                const data = await response.json();
                const formattedOrders = data.map(order => ({
                    _id: order._id,
                    createdAt: order.createdAt,
                    status: order.status,
                    totalPrice: order.totalPrice,
                    shippingAddress: {
                        name: order.shippingAddress?.name || order.name || 'N/A',
                        address: order.shippingAddress?.address || order.address || 'N/A',
                        city: order.shippingAddress?.city || order.city || 'N/A',
                        postalCode: order.shippingAddress?.postalCode || order.postalCode || 'N/A'
                    },
                    orderItems: Array.isArray(order.orderItems) ? order.orderItems.map(item => ({
                        name: item.name || item.product?.name || 'Product',
                        image: item.image || item.product?.image || '/placeholder.jpg',
                        category: item.category || item.product?.category || 'N/A',
                        quantity: item.quantity || 1,
                        price: item.price || item.product?.price || 0
                    })) : []
                }));

                setOrders(formattedOrders);
            } catch (err) {
                setError(err.message || 'Unable to fetch your orders. Please try again.');
                if (err.message.includes('jwt')) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'success';
            case 'Shipped':
                return 'info';
            case 'Processing':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    // Add safe access function
    const safeOrderAccess = (order) => {
        if (!order) return null;
        return {
            _id: order._id || 'Unknown',
            createdAt: order.createdAt || new Date().toISOString(),
            status: order.status || 'Processing',
            totalPrice: order.totalPrice || 0,
            shippingAddress: {
                name: order.shippingAddress?.name || 'N/A',
                address: order.shippingAddress?.address || 'N/A',
                city: order.shippingAddress?.city || 'N/A',
                postalCode: order.shippingAddress?.postalCode || 'N/A'
            },
            orderItems: Array.isArray(order.orderItems) ? order.orderItems.map(item => ({
                name: item.name || 'Product',
                image: item.image || '/placeholder.jpg',
                category: item.category || 'N/A',
                quantity: item.quantity || 1,
                price: item.price || 0
            })) : []
        };
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <>
            <div className="orders-container">
                <div className="orders-header">
                    <h1 className="orders-title">Order History</h1>
                    <p className="orders-subtitle">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <Card className="text-center p-5">
                            <Card.Body>
                                <i className="fas fa-shopping-bag fa-3x mb-3 text-muted"></i>
                                <h3>No Orders Yet</h3>
                                <p className="text-muted">Start shopping to see your orders here</p>
                                <Link to="/products" className="btn btn-primary">
                                    Browse Products
                                </Link>
                            </Card.Body>
                        </Card>
                    </div>
                ) : (
                    <Row>
                        <Col lg={8}>
                            <div className="orders-list-container">
                                {orders.map((order) => (
                                    <div key={order._id} className="order-item">
                                        <Row className="align-items-center g-3">
                                            <Col md={3}>
                                                <div className="order-id">#{order._id.slice(-6)}</div>
                                                <div className="order-date">{formatDate(order.createdAt)}</div>
                                            </Col>
                                            <Col md={3}>
                                                <Badge bg={getStatusColor(order.status)} className="status-badge">
                                                    {order.status}
                                                </Badge>
                                            </Col>
                                            <Col md={3}>
                                                <div className="order-price">{formatPrice(order.totalPrice)}</div>
                                            </Col>
                                            <Col md={3} className="text-md-end">
                                                <Button
                                                    variant="outline-primary"
                                                    className="view-details-btn w-100 w-md-auto"
                                                    onClick={() => setViewingOrder(order)}
                                                >
                                                    <i className="fas fa-eye me-2"></i>View Details
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </div>
                        </Col>

                        <Col lg={4}>
                            <Card className="orders-summary">
                                <Card.Body>
                                    <h2 className="summary-title">Orders Summary</h2>
                                    <div className="summary-stats">
                                        <div className="stat-item">
                                            <span className="stat-label">Total Orders</span>
                                            <span className="stat-value">{orders.length}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Completed</span>
                                            <span className="stat-value">
                                                {orders.filter(order => order.status === 'Delivered').length}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="light"
                                        className="help-button"
                                        onClick={() => setShowHelpModal(true)}
                                    >
                                        <i className="fas fa-question-circle me-2"></i>
                                        Need Help?
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>

            {/* Order Details Modal */}
            <Modal
                show={viewingOrder !== null}
                onHide={() => setViewingOrder(null)}
                size="lg"
                centered
                className="order-details-modal"
            >
                {viewingOrder && safeOrderAccess(viewingOrder) && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Order #{safeOrderAccess(viewingOrder)._id.slice(-6)}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="order-info-section">
                                <Row>
                                    <Col md={6}>
                                        <h5>Shipping Details</h5>
                                        <div className="info-group">
                                            <p><strong>Name:</strong> {safeOrderAccess(viewingOrder).shippingAddress.name}</p>
                                            <p><strong>Address:</strong> {safeOrderAccess(viewingOrder).shippingAddress.address}</p>
                                            <p><strong>City:</strong> {safeOrderAccess(viewingOrder).shippingAddress.city}</p>
                                            <p><strong>Postal Code:</strong> {safeOrderAccess(viewingOrder).shippingAddress.postalCode}</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <h5>Order Information</h5>
                                        <div className="info-group">
                                            <p><strong>Order Date:</strong> {formatDate(safeOrderAccess(viewingOrder).createdAt)}</p>
                                            <p>
                                                <strong>Status:</strong>{' '}
                                                <Badge bg={getStatusColor(safeOrderAccess(viewingOrder).status)}>
                                                    {safeOrderAccess(viewingOrder).status}
                                                </Badge>
                                            </p>
                                            <p><strong>Total Amount:</strong> {formatPrice(safeOrderAccess(viewingOrder).totalPrice)}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div className="order-items-section">
                                <h5>Order Items</h5>
                                <ListGroup variant="flush">
                                    {safeOrderAccess(viewingOrder).orderItems.map((item, index) => (
                                        <ListGroup.Item key={index} className="order-item-detail">
                                            <Row className="align-items-center">
                                                <Col xs={3} md={2}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="item-image"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                </Col>
                                                <Col xs={9} md={4}>
                                                    <h6>{item.name}</h6>
                                                    <p className="text-muted mb-0">Category: {item.category}</p>
                                                </Col>
                                                <Col xs={6} md={3} className="text-center">
                                                    <span className="quantity">Qty: {item.quantity}</span>
                                                </Col>
                                                <Col xs={6} md={3} className="text-end">
                                                    <span className="price">{formatPrice(item.price * item.quantity)}</span>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setViewingOrder(null)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            {/* Help Modal */}
            <Modal
                show={showHelpModal}
                onHide={() => setShowHelpModal(false)}
                centered
                className="help-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Need Help?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="help-content">
                        <h5>How can we assist you?</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item action onClick={() => navigate('/support')}>
                                <i className="fas fa-headset"></i>
                                Contact Customer Support
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => navigate('/faq')}>
                                <i className="fas fa-question-circle"></i>
                                View FAQs
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => navigate('/returns')}>
                                <i className="fas fa-undo-alt"></i>
                                Returns & Refunds
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => navigate('/tracking')}>
                                <i className="fas fa-truck"></i>
                                Track Your Order
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHelpModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
}

export default Orders;
