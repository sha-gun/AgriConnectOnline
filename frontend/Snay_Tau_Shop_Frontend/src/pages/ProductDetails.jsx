import { useEffect, useState } from 'react';
import { Container, Row, Col, Image, ListGroup, Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api';
import axios from 'axios'; // Added import

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({});
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/products/${id}`); // Changed fetch to axios
                setProduct(data);
                setLoading(false);
            } catch (err) {
                console.error('API Fetch Error:', err); // Added logging
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Handle Add to Cart
    const handleAddToCart = () => {
        alert(`Added ${qty} of ${product.name} to cart!`);
        // Here you can implement logic to add to global cart state or localStorage
    };

    // Loading State
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <Container className="my-5 d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div>
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                    <div className="text-center">
                        <Link to="/products">Go Back</Link>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="my-5">
                {/* Back Button */}
                <Button variant="light" className="mb-3" onClick={() => navigate(-1)}>
                    ← Go Back
                </Button>

                {/* Product Details */}
                <Row>
                    {/* Product Image */}
                    <Col md={6}>
                        <Image
                            src={product.image || '/assets/product-placeholder.jpg'}
                            alt={product.name || 'Product Image'}
                            fluid
                            className="rounded shadow-sm"
                        />
                    </Col>

                    {/* Product Information */}
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name || 'Product Name'}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Price:</strong> ₹{product.price?.toFixed(2) || 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Description:</strong> {product.description || 'No description available'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Category:</strong> {product.category || 'Uncategorized'}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    {/* Purchase Actions */}
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Price:</strong></Col>
                                        <Col>
                                            ₹{product.price?.toFixed(2) || 'N/A'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Status:</strong></Col>
                                        <Col>
                                            {product.stock && product.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/* Quantity Selector */}
                                {product.stock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={(e) => setQty(Number(e.target.value))}
                                                >
                                                    {[...Array(product.stock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                {/* Add to Cart Button */}
                                <ListGroup.Item>
                                    <Button
                                        className="w-100"
                                        type="button"
                                        disabled={!product.stock || product.stock === 0}
                                        onClick={handleAddToCart}
                                    >
                                        Add To Cart
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
}

export default ProductDetails;
