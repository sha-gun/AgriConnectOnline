import { Container, Row, Col, Button, Card, Badge, Spinner, Alert } from "react-bootstrap";
import Footer from "../components/Footer"; // Ensure the path is correct
import Hero from "../components/Hero";
import { motion } from "framer-motion";
import "./Home.css"; // Import the CSS file for styling
import { FaStar, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiShoppingBag } from "react-icons/fi";
import { API_URL } from "../services/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Function to open Google Maps directions
    const handleGetDirections = () => {
        const address = "Kissan krishi seva kendra, Bharatpur, Rajasthan";
        const encodedAddress = encodeURIComponent(address);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        window.open(mapsUrl, '_blank');
    };

    // Function to copy address to clipboard
    const handleCopyAddress = () => {
        const address = "Kissan krishi seva kendra, Bharatpur, Rajasthan";
        navigator.clipboard.writeText(address)
            .then(() => {
                // You can add a toast notification here if you want
                alert("Address copied to clipboard!");
            })
            .catch(err => {
                console.error('Failed to copy address: ', err);
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <Hero />

            {/* Featured Products Section */}
            <section className="featured-products py-5">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-5"
                    >
                        <h2 className="section-title">
                            <span className="emoji">🌟</span> Featured Products
                        </h2>
                        <p className="section-subtitle">Quality agricultural equipment for your needs</p>
                    </motion.div>

                    <Row className="g-4">
                        {loading ? (
                            <div className="loading-container">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <Alert variant="info" className="text-center">
                                No products available at the moment.
                            </Alert>
                        ) : (
                            products.slice(0, 3).map((product) => (
                                <Col key={product._id} lg={4} md={6}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => navigate(`/products/${product._id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Card className="featured-product-card">
                                            <div className="product-image-wrapper">
                                                <Card.Img 
                                                    variant="top" 
                                                    src={product.image || "/assets/product-placeholder.jpg"}
                                                    alt={product.name}
                                                    className="product-image"
                                                />
                                                <div className="product-overlay">
                                                    <span className="view-details">View Details</span>
                                                </div>
                                            </div>
                                            <Card.Body className="text-center p-4">
                                                <Badge className="category-badge mb-2">
                                                    {product.category || 'General'}
                                                </Badge>
                                                <Card.Title className="product-title mt-2">
                                                    {product.name}
                                                </Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))
                        )}
                    </Row>
                </Container>
            </section>

            {/* Owner & Location Section */}
            <section className="owner-location">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-5"
                    >
                        <h2 className="section-title">Meet Our Team</h2>
                        <p className="section-subtitle">Get to know us and find our location</p>
                    </motion.div>

                    <Row className="g-4 align-items-stretch">
                        {/* Owner Information */}
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="owner-info"
                            >
                                <div className="owner-profile">
                                    <div className="owner-avatar">
                                        {/* Default avatar icon if image fails to load */}
                                        <svg 
                                            viewBox="0 0 24 24" 
                                            fill="currentColor" 
                                            className="default-avatar"
                                        >
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="owner-title">Shagun</h3>
                                        <span className="owner-role">Owner & Manager</span>
                                    </div>
                                </div>

                                <div className="owner-details">
                                    <p className="mb-4">
                                        With over 15 years of experience in the agricultural sector, 
                                        dedicated to providing high-quality farming products and exceptional service.
                                    </p>

                                    <div className="contact-item">
                                        <span className="contact-icon">📞</span>
                                        <span>+91 98285 82401</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-icon">✉️</span>
                                        <span>rajesh.khandelwal@example.com</span>
                                    </div>
                                </div>

                                <div className="social-links">
                                    <a href="#" className="social-link">FB</a>
                                    <a href="#" className="social-link">IN</a>
                                    <a href="#" className="social-link">TW</a>
                                </div>
                            </motion.div>
                        </Col>

                        {/* Location Information */}
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="map-container"
                            >
                                <div className="location-header">
                                    <h4 className="location-title">Visit Our Store</h4>
                                    <p className="location-address">
                                        Delhi Rd, Ramgarh, Alwar - 301026 (Nr Dal Mill)
                                    </p>
                                </div>

                                <iframe
                                    title="Shop Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.3010387516742!2d76.81271517497072!3d27.584195030913325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39729567720fb201%3A0xa7134818c0e8d3d!2sKissan%20krishi%20seva%20kendra!5e0!3m2!1sen!2sin!4v1736350173038!5m2!1sen!2sin"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: "15px" }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>

                                <div className="map-actions">
                                    <button 
                                        className="map-button directions-btn"
                                        onClick={handleGetDirections}
                                    >
                                        <span>📍</span> Get Directions
                                    </button>
                                    <button 
                                        className="map-button copy-btn"
                                        onClick={handleCopyAddress}
                                    >
                                        <span>📋</span> Copy Address
                                    </button>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Enhanced Testimonials Section */}
            <section className="testimonials py-5">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-5"
                    >
                        <h2 className="section-title">What Our Customers Say</h2>
                        <p className="section-subtitle">Real experiences from our valued customers</p>
                    </motion.div>

                    <Row className="g-4">
                        {[
                            {
                                name: "Rahul Sharma",
                                role: "Farmer",
                                location: "Alwar, Rajasthan",
                                rating: 5,
                                text: "Excellent quality tractor parts and exceptional service. The team's expertise in agricultural equipment is impressive.",
                                date: "2 weeks ago"
                            },
                            {
                                name: "Amit Patel",
                                role: "Farm Owner",
                                location: "Bharatpur, Rajasthan",
                                rating: 5,
                                text: "Best place for farming equipment. Their products are durable and reasonably priced. Highly recommended!",
                                date: "1 month ago"
                            },
                            {
                                name: "Suresh Kumar",
                                role: "Agricultural Contractor",
                                location: "Jaipur, Rajasthan",
                                rating: 5,
                                text: "Great selection of thresher parts. The staff is knowledgeable and helped me find exactly what I needed.",
                                date: "3 weeks ago"
                            }
                        ].map((testimonial, index) => (
                            <Col lg={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    className="testimonial-card"
                                >
                                    <FaQuoteLeft className="quote-icon" />
                                    <p className="testimonial-text">{testimonial.text}</p>
                                    
                                    <div className="testimonial-rating mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FaStar key={i} className="star-icon" />
                                        ))}
                                    </div>

                                    <div className="testimonial-footer">
                                        <div className="testimonial-avatar">
                                            <div className="avatar-icon">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="testimonial-info">
                                            <h5 className="testimonial-name">{testimonial.name}</h5>
                                            <p className="testimonial-role">{testimonial.role}</p>
                                            <p className="testimonial-location">
                                                <FaMapMarkerAlt className="me-1" />
                                                {testimonial.location}
                                            </p>
                                        </div>
                                    </div>
                                        <small className="testimonial-date">{testimonial.date}</small>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Call-to-Action Section */}
            <section className="cta-section text-center py-5">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="fw-bold text-primary">Visit Us Today!</h3>
                        <p className="mb-4 text-muted">
                            Drop by our store or contact us for more information.
                        </p>
                        <Button variant="primary" className="fw-medium px-4 py-2">
                            Get in Touch
                        </Button>
                    </motion.div>
                </Container>
            </section>

            {/* Footer */}
            <Footer />
        </motion.div>
    );
}

export default Home;
