import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { API_URL } from '../services/api';
import axios from 'axios';
import './Checkout.css';

function Checkout() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [itemTotal, setItemTotal] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const shippingFee = 100;

    const navigate = useNavigate();

    // Fetch Cart Items
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('You must be logged in to proceed to checkout');

                const response = await axios.get(`${API_URL}/cart`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data) {
                    setCartItems(response.data);
                    const total = response.data.reduce((acc, item) => acc + (item.product?.price || 0) * item.qty, 0);
                    setItemTotal(total);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch cart items');
            }
        };

        fetchCartItems();
    }, []);

    // Handle Place Order
    const handlePlaceOrder = async () => {
        setError(null);

        if (!name || !address || !city || !postalCode || !country) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('You must be logged in to place an order');

            const response = await axios.post(`${API_URL}/orders`, {
                name,
                email,
                address,
                city,
                postalCode,
                country,
                paymentMethod: 'Cash on Delivery',
                items: cartItems.map(item => ({
                    product: item.product._id,
                    qty: item.qty,
                })),
                totalPrice: itemTotal + shippingFee,
                shippingFee,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                // Clear cart in backend
                await axios.delete(`${API_URL}/cart/clear`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Clear cart state locally
                setCartItems([]);
                setItemTotal(0);

                // Show success modal
                setShowSuccessModal(true);

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate('/orders');
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Container className="checkout-container my-5">
                <h1 className="checkout-title text-center mb-4 fw-bold">🛒 Checkout</h1>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Row>
                    {/* Delivery Details */}
                    <Col md={8}>
                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="fw-bold">📦 Delivery Details</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="name" className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="email" className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="address" className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId="city" className="mb-3">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter your city"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="postalCode" className="mb-3">
                                                <Form.Label>Postal Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter postal code"
                                                    value={postalCode}
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group controlId="country" className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Payment Method */}
                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="fw-bold">💳 Payment Method</Card.Header>
                            <Card.Body>
                                <Alert variant="info">Payment method is set to <strong>Cash on Delivery</strong>.</Alert>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Order Summary */}
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Header className="fw-bold">📝 Order Summary</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Items:</strong> ₹{itemTotal.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Shipping:</strong> ₹{shippingFee.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Total:</strong> ₹{(itemTotal + shippingFee).toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        variant="success"
                                        className="w-100"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    className="me-2"
                                                />
                                                Processing...
                                            </>
                                        ) : (
                                            'Place Order'
                                        )}
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Success Modal */}
            <Modal 
                show={showSuccessModal} 
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className="border-0">
                    <Modal.Title className="w-100 text-center">
                        <span className="display-6">🎉</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <h4>Order Placed Successfully!</h4>
                    <p className="mb-0">Thank you for your order.</p>
                    <p className="text-muted">Redirecting to orders page...</p>
                    <div className="mt-3">
                        <Spinner animation="border" variant="primary" size="sm" />
                    </div>
                </Modal.Body>
            </Modal>

            <Footer />
        </>
    );
}

export default Checkout;
