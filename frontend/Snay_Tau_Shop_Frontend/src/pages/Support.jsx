// src/pages/Support.jsx
import { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Accordion } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaClock, FaCheckCircle } from 'react-icons/fa';
import './Support.css';

function Support() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Container className="support-container py-5">
                {/* Header Section */}
                <div className="header-section text-center mb-5">
                    <h1 className="support-title">How Can We Help You?</h1>
                    <p className="support-subtitle">We are here to help and answer any question you might have</p>
                </div>

                <Row className="g-4">
                    {/* Contact Information */}
                    <Col lg={4}>
                        <div className="contact-info">
                            {/* Quick Contact */}
                            <Card className="contact-card mb-4">
                                <Card.Body>
                                    <h5 className="section-title">Quick Contact</h5>
                                    <div className="contact-item">
                                        <FaEnvelope className="contact-icon" />
                                        <div>
                                            <h6>Email Us</h6>
                                            <p>support@kisaankrishiseva.com</p>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <FaPhone className="contact-icon" />
                                        <div>
                                            <h6>Call Us</h6>
                                            <p>+91-9068796093</p>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <FaWhatsapp className="contact-icon" />
                                        <div>
                                            <h6>WhatsApp</h6>
                                            <p>+91-9068796093</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Business Hours */}
                            <Card className="contact-card mb-4">
                                <Card.Body>
                                    <h5 className="section-title">Business Hours</h5>
                                    <div className="contact-item">
                                        <FaClock className="contact-icon" />
                                        <div>
                                            <h6>Monday - Saturday</h6>
                                            <p>9:00 AM - 7:00 PM</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Office Location */}
                            <Card className="contact-card">
                                <Card.Body>
                                    <h5 className="section-title">Office Location</h5>
                                    <div className="contact-item">
                                        <FaMapMarkerAlt className="contact-icon" />
                                        <div>
                                            <h6>Head Office</h6>
                                            <p>123, Krishi Mandi<br /><br />Pin: 244001</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    {/* Contact Form */}
                    <Col lg={8}>
                        <Card className="form-card">
                            <Card.Body>
                                <h5 className="section-title mb-4">Send us a Message</h5>
                                {submitted && (
                                    <Alert variant="success" className="d-flex align-items-center">
                                        <FaCheckCircle className="me-2" />
                                        Thank you for your message. We will get back to you soon!
                                    </Alert>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Your Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter your name"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email Address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Subject</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="What is this regarding?"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Message</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="How can we help you?"
                                            required
                                        />
                                    </Form.Group>
                                    <div className="text-end">
                                        <Button type="submit" className="submit-button">
                                            Send Message
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* FAQ Section */}
                <div className="faq-section mt-5">
                    <h3 className="text-center mb-4">Frequently Asked Questions</h3>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>How do I track my order?</Accordion.Header>
                            <Accordion.Body>
                                You can track your order by logging into your account and visiting the Orders section. There you will find real-time updates on your order status.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>What payment methods do you accept?</Accordion.Header>
                            <Accordion.Body>
                                We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery for your convenience.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>What is your return policy?</Accordion.Header>
                            <Accordion.Body>
                                We offer a 7-day return policy for most items. Products must be unused and in their original packaging to be eligible for return.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>How long does shipping take?</Accordion.Header>
                            <Accordion.Body>
                                Shipping typically takes 3-5 business days depending on your location. Express delivery options are available for select areas.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Container>
        </motion.div>
    );
}

export default Support;