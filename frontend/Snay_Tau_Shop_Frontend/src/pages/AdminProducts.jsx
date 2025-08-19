import './AdminProducts.css';
import { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Fetch all products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/products`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setMessage('Product deleted successfully');
            setProducts(products.filter(product => product._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="admin-products-container"
        >
            <Container>
                <h2 className="admin-products-title">Manage Products</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <Spinner animation="border" role="status" className="loading-spinner">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                        <Link to="/admin/products/create">
                            <Button className="add-product-btn mb-4">
                                <i className="fas fa-plus"></i> Add Product
                            </Button>
                        </Link>
                        <Table className="products-table" responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Sizes Available</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>₹{product.price.toFixed(2)}</td>
                                        <td>{product.category}</td>
                                        <td className={product.stock < 10 ? 'stock-warning' : 'stock-ok'}>
                                            {product.stock}
                                        </td>
                                        <td>
                                            {product.sizes.map(size => (
                                                <span key={size.size} className="size-badge">
                                                    {size.size}: {size.stock}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="description-cell">{product.description}</td>
                                        <td>
                                            <Link to={`/admin/products/${product._id}/edit`}>
                                                <Button className="edit-btn me-2">
                                                    <i className="fas fa-edit"></i>
                                                </Button>
                                            </Link>
                                            <Button
                                                className="delete-btn"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </Container>
        </motion.div>
    );
}

export default AdminProducts;
