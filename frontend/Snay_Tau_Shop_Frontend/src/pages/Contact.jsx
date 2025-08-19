import { Container, Form, Button } from 'react-bootstrap';
import './Contact.css';

function ContactPage() {
    return (
        <Container className="contact-page">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-subtitle">We do love to hear from you! Fill out the form below and we will get back to you as soon as possible.</p>
            <Form className="contact-form">
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" required />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" required />
                </Form.Group>

                <Form.Group controlId="formSubject" className="mt-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="text" placeholder="Enter subject" required />
                </Form.Group>

                <Form.Group controlId="formMessage" className="mt-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="Write your message here..." required />
                </Form.Group>

                <Button type="submit" className="mt-4 contact-submit-btn">Submit</Button>
            </Form>
        </Container>
    );
}

export default ContactPage;
