import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaHistory, FaHandshake, FaTractor, FaUsers } from 'react-icons/fa';
import './About.css';

function About() {
    const stats = [
        { icon: <FaHistory />, number: "15+", label: "Years Experience" },
        { icon: <FaHandshake />, number: "1000+", label: "Happy Customers" },
        { icon: <FaTractor />, number: "500+", label: "Products" },
        { icon: <FaUsers />, number: "50+", label: "Team Members" }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <section className="about-hero">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="about-title">About Kisaan Seva</h1>
                                <p className="about-subtitle">
                                    Your Trusted Partner in Agricultural Solutions Since 2010
                                </p>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Our Story Section */}
            <section className="about-section">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="section-title">Our Story</h2>
                                <p className="section-text">
                                    Founded in 2010, Kisaan Seva began with a simple mission: to provide 
                                    farmers with high-quality agricultural equipment and exceptional service. 
                                    What started as a small shop has grown into a trusted name in the 
                                    agricultural community.
                                </p>
                                <p className="section-text">
                                    Today, we continue to serve farmers across Uttar Pradesh with the same 
                                    dedication and commitment to quality that we started with. Our team 
                                    of experts ensures that every customer receives personalized attention 
                                    and the best solutions for their farming needs.
                                </p>
                            </motion.div>
                        </Col>
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="about-image-container"
                            >
                                <img 
                                    src="/path-to-your-image.jpg" 
                                    alt="Kisaan Seva Store" 
                                    className="about-image"
                                />
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <Container>
                    <Row>
                        {stats.map((stat, index) => (
                            <Col key={index} md={3} sm={6}>
                                <motion.div 
                                    className="stat-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <div className="stat-icon">{stat.icon}</div>
                                    <h3 className="stat-number">{stat.number}</h3>
                                    <p className="stat-label">{stat.label}</p>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <Container>
                    <h2 className="text-center section-title mb-5">Our Values</h2>
                    <Row className="g-4">
                        {[
                            {
                                title: "Quality",
                                description: "We provide only the highest quality products to ensure your success."
                            },
                            {
                                title: "Integrity",
                                description: "Honest dealings and transparent business practices are our foundation."
                            },
                            {
                                title: "Service",
                                description: "Customer satisfaction is at the heart of everything we do."
                            },
                            {
                                title: "Innovation",
                                description: "We continuously evolve to meet the changing needs of modern farming."
                            }
                        ].map((value, index) => (
                            <Col key={index} md={3}>
                                <motion.div 
                                    className="value-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <h3 className="value-title">{value.title}</h3>
                                    <p className="value-text">{value.description}</p>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </motion.div>
    );
}

export default About; 