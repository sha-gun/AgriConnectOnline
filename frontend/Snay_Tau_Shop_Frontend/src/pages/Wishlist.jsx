// src/pages/Wishlist.jsx

import { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Wishlist.css';

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: "Tractor Model X200",
            price: "$12,000",
            image: "https://via.placeholder.com/150",
        },
        {
            id: 2,
            name: "Thresher Pro 5000",
            price: "$8,000",
            image: "https://via.placeholder.com/150",
        },
    ]);

    const removeFromWishlist = (id) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    return (
        <Container className="wishlist-container mt-5">
            <h1 className="text-center mb-4">Your Wishlist 💖</h1>
            {wishlistItems.length === 0 ? (
                <Alert variant="info" className="text-center">
                    Your wishlist is empty. <Link to="/products">Browse Products</Link>
                </Alert>
            ) : (
                <Row>
                    {wishlistItems.map(item => (
                        <Col md={4} key={item.id}>
                            <Card className="wishlist-card mb-4 shadow-sm">
                                <Card.Img variant="top" src={item.image} />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>Price: {item.price}</Card.Text>
                                    <Button
                                        variant="danger"
                                        onClick={() => removeFromWishlist(item.id)}
                                    >
                                        Remove
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default Wishlist;
