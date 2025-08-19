import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import tractorAnimation from '../assets/lottie/hero_animation.json';
import './Hero.css';

function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg-pattern"></div>
            <Container fluid>
                <Row className="g-0 justify-content-center">
                    {/* Left Side: Content */}
                    <Col lg={6} className="hero-content">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="hero-badge">
                                🚜 Premium Quality Parts
                            </span>
                            <h1 className="hero-title">
                                Your Trusted Source for
                                <span className="text-gradient"> Farm Equipment Parts</span>
                            </h1>
                            <p className="hero-description">
                                Genuine tractor parts, thresher components, and agricultural machinery 
                                spares - keeping your equipment running at peak performance.
                            </p>
                            
                            <div className="hero-cta-group">
                                <Button 
                                    as={Link}
                                    to="/products"
                                    className="cta-button primary"
                                >
                                    Tractor Parts <span className="icon">→</span>
                                </Button>
                            </div>

                            <div className="hero-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span className="feature-text">Genuine Parts</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">🔧</span>
                                    <span className="feature-text">Expert Support</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">🚚</span>
                                    <span className="feature-text">Fast Delivery</span>
                                </div>
                            </div>
                        </motion.div>
                    </Col>

                    {/* Right Side: Animation */}
                    <Col lg={6} className="hero-animation-wrapper">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hero-animation"
                        >
                            <Lottie
                                animationData={tractorAnimation}
                                loop={true}
                                className="hero-lottie"
                            />
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default Hero;
