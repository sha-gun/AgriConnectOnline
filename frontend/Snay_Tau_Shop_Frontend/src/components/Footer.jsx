import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowUp } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import './Footer.css';

function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Add newsletter subscription logic here
        alert('Thank you for subscribing!');
    };

    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="footer"
        >
            <Container>
                {/* Main Footer Content */}
                <Row className="footer-content g-4">
                    {/* About Section */}
                    <Col lg={3} md={6}>
                        <div className="footer-section">
                            <h5 className="footer-title">
                                <span className="title-emoji">🌾</span> Kisaan Seva
                            </h5>
                            <p className="footer-about">
                                Your trusted partner for agricultural solutions and high-quality tractor parts. 
                                Serving farmers with pride since 2010.
                            </p>
                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <FaFacebookF />
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <FaTwitter />
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="social-link" aria-label="LinkedIn">
                                    <FaLinkedinIn />
                                </a>
                            </div>
                        </div>
                    </Col>

                    {/* Quick Links */}
                    <Col lg={3} md={6}>
                        <div className="footer-section">
                            <h5 className="footer-title">Quick Links</h5>
                            <ul className="footer-links">
                                <li><a href="/">Home</a></li>
                                <li><a href="/products">Products</a></li>
                                <li><a href="/about">About Us</a></li>
                                <li><a href="/contact">Contact</a></li>
                                <li><a href="/faq">FAQ</a></li>
                            </ul>
                        </div>
                    </Col>

                    {/* Contact Info */}
                    <Col lg={3} md={6}>
                        <div className="footer-section">
                            <h5 className="footer-title">Contact Us</h5>
                            <ul className="contact-info">
                                <li>
                                    <MdEmail className="contact-icon" />
                                    <a href="mailto:info@kisaanseva.com">info@kisaanseva.com</a>
                                </li>
                                <li>
                                    <MdPhone className="contact-icon" />
                                    <a href="tel:+919828582401">+91 9828582401 </a>
                                </li>
                                <li>
                                    <MdLocationOn className="contact-icon" />
                                    <span>Delhi Rd, Ramgarh, Alwar - 301026 (Nr Dal Mill)</span>
                                </li>
                            </ul>
                        </div>
                    </Col>

                    {/* Newsletter */}
                    <Col lg={3} md={6}>
                        <div className="footer-section">
                            <h5 className="footer-title">Newsletter</h5>
                            <p>Stay updated with our latest products and offers.</p>
                            <Form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        className="newsletter-input"
                                    />
                                </Form.Group>
                                <Button 
                                    type="submit" 
                                    variant="primary"
                                    className="newsletter-button w-100"
                                >
                                    Subscribe
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>

                {/* Divider */}
                <hr className="footer-divider" />

                {/* Bottom Footer */}
                <Row className="footer-bottom">
                    <Col md={6} className="text-center text-md-start">
                        <p className="mb-0">
                            © {new Date().getFullYear()} Kisaan Seva. All rights reserved.
                        </p>
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <a href="/privacy" className="footer-bottom-link">Privacy Policy</a>
                        <span className="mx-2">|</span>
                        <a href="/terms" className="footer-bottom-link">Terms of Service</a>
                    </Col>
                </Row>
            </Container>

            {/* Scroll to Top Button */}
            <button 
                className="scroll-to-top"
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <FaArrowUp />
            </button>
        </motion.footer>
    );
}

export default Footer;
