import { useState } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api';

function AdminAddProduct() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [sizes, setSizes] = useState([{ size: '', stock: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    const addSizeField = () => {
        setSizes([...sizes, { size: '', stock: '' }]);
    };

    const removeSizeField = (index) => {
        const newSizes = sizes.filter((_, i) => i !== index);
        setSizes(newSizes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Filter out empty size entries
        const validSizes = sizes.filter(size => size.size && size.stock);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    category,
                    description,
                    image,
                    sizes: validSizes.map(size => ({
                        size: size.size,
                        stock: parseInt(size.stock, 10)
                    }))
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add product');
            }

            setSuccess('Product added successfully!');
            setTimeout(() => navigate('/admin/products'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="my-5">
                <h2 className="mb-4 text-center">Add New Product</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="productName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            placeholder="Enter product price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sizes and Stock</Form.Label>
                        {sizes.map((size, index) => (
                            <Row key={index} className="mb-2">
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Size (e.g., S, M, L, XL)"
                                        value={size.size}
                                        onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Stock quantity"
                                        value={size.stock}
                                        onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col xs="auto">
                                    {sizes.length > 1 && (
                                        <Button 
                                            variant="danger" 
                                            onClick={() => removeSizeField(index)}
                                            className="me-2"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    )}
                                    {index === sizes.length - 1 && (
                                        <Button variant="success" onClick={addSizeField}>
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter product description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productImage">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading} className="w-100">
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" /> Adding Product...
                            </>
                        ) : (
                            'Add Product'
                        )}
                    </Button>
                </Form>
            </Container>
        </motion.div>
    );
}

export default AdminAddProduct;
