import { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Image, Button, Card, Alert, Spinner, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';
import Footer from '../components/Footer';
import './Cart.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]); // State for cart items
    const [error, setError] = useState(null); // State for error messages
    const [loading, setLoading] = useState(true); // State for loading
    const [removingItem, setRemovingItem] = useState(null); // Track item being removed

    const navigate = useNavigate();

    // 📦 Fetch Cart Items
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('You must be logged in to view the cart');
                }

                const response = await fetch(`${API_URL}/cart`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }

                const data = await response.json();
                setCartItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    // 🗑️ Remove Item from Cart
    const handleRemoveFromCart = async (productId) => {
        setRemovingItem(productId); // Show loading state on the button

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to remove items from the cart');
            }
            const response = await fetch(`${API_URL}/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item from cart');
            }

            const updatedCart = await response.json();
            setCartItems(updatedCart);
        } catch (err) {
            console.error('❌ Error removing item:', err.message);
            setError(err.message || 'Failed to remove item from cart');
        } finally {
            setRemovingItem(null); // Reset button loading state
        }
    };



    // 🔄 Update Quantity
    const handleUpdateQuantity = async (id, newQty) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: id,
                    qty: newQty,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }

            const updatedCart = await response.json();
            setCartItems(updatedCart);
        } catch (err) {
            setError(err.message || 'Failed to update quantity');
        }
    };

    // 🛒 Proceed to Checkout
    const handleCheckout = () => {
        navigate('/checkout');
    };

    // 🔄 Loading State
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // ❌ Error State
    if (error) {
        return (
            <Container className="my-5 d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <>
            {/* 🛒 Main Cart Container */}
            <Container className="cart-container my-5">
                <h1 className="cart-title text-center mb-4 fw-bold">🛍️ Shopping Cart</h1>

                {/* Empty Cart Alert */}
                {cartItems.length === 0 ? (
                    <Alert variant="info" className="text-center">
                        Your cart is empty. <Link to="/products" className="text-primary">Browse Products</Link>
                    </Alert>
                ) : (
                    <Row>
                        {/* 📝 Cart Items List */}
                        <Col md={8}>
                            <ListGroup variant="flush" className="cart-items">
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item._id} className="cart-item">
                                        <Row className="align-items-center">
                                            {/* 📷 Product Image */}
                                            <Col md={2}>
                                                <Image
                                                    src={item.product?.image || '/assets/product-placeholder.jpg'}
                                                    alt={item.product?.name}
                                                    fluid
                                                    rounded
                                                />
                                            </Col>

                                            {/* 📝 Product Details */}
                                            <Col md={4}>
                                                <Link to={`/products/${item.product?._id}`} className="cart-item-link">
                                                    {item.product?.name || 'Product Name'}
                                                </Link>
                                                <p className="text-muted small">{item.product?.category || 'Uncategorized'}</p>
                                            </Col>

                                            {/* 💵 Price */}
                                            <Col md={2} className="cart-item-price">
                                                ₹{item.product?.price?.toFixed(2) || 'N/A'}
                                            </Col>

                                            {/* 🔄 Quantity */}
                                            <Col md={2}>
                                                <Form.Control
                                                    as="select"
                                                    value={item.qty}
                                                    onChange={(e) => handleUpdateQuantity(item.product?._id, Number(e.target.value))}
                                                >
                                                    {[...Array(item.product?.stock || 1).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>

                                            {/* 🗑️ Remove Button */}
                                            <Col md={2}>
                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveFromCart(item.product._id)}
                                                disabled={removingItem === item.product._id}
                                            >
                                                {removingItem === item.product._id ? (
                                                    <Spinner animation="border" size="sm" />
                                                ) : (
                                                    <i className="fas fa-trash"></i>
                                                )}
                                            </Button>

                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>

                        {/* 📊 Cart Summary */}
                        <Col md={4}>
                            <Card className="cart-summary shadow-sm">
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h2 className="cart-summary-title">Order Summary</h2>
                                        <p>
                                            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):
                                            <strong> ₹{cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.qty, 0).toFixed(2)}</strong>
                                        </p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Button
                                            variant="success"
                                            className="w-100"
                                            onClick={handleCheckout}
                                            disabled={cartItems.length === 0}
                                        >
                                            Proceed To Checkout
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>

            {/* 📊 Footer */}
            <Footer />
        </>
    );
}

export default Cart;
