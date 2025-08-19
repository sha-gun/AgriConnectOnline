// src/components/Products.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Dropdown, Card, Button, Form, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiShoppingBag } from "react-icons/fi";
import Footer from "../components/Footer";
import { API_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState([0, 10000]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();

                const uniqueCategories = ["All", ...new Set(data.map((product) => product.category || "Uncategorized"))];
                setProducts(data);
                setFilteredProducts(data);
                setCategories(uniqueCategories);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        applyFilters(searchQuery, category, priceRange);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        applyFilters(query, selectedCategory, priceRange);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange((prev) => (name === "min" ? [Number(value), prev[1]] : [prev[0], Number(value)]));
    };

    const applyFilters = (query, category, price) => {
        let filtered = products;

        if (category !== "All") {
            filtered = filtered.filter((product) => product.category === category);
        }

        if (query) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        filtered = filtered.filter(
            (product) => product.price >= price[0] && product.price <= price[1]
        );

        setFilteredProducts(filtered);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="products-page"
        >
            {/* Header Section */}
            <div className="products-header">
                <Container>
                    <h2 className="section-title">
                        <span className="emoji">🛍️</span>
                        Explore Our Products
                        <span className="emoji">✨</span>
                    </h2>
                    <p className="section-subtitle">Discover our curated collection of premium products, handpicked just for you</p>
                </Container>
            </div>

            {/* Search and Filter Section */}
            <Container className="filter-section">
                <Row className="g-3">
                    <Col lg={4} md={6}>
                        <div className="search-wrapper">
                            <FiSearch className="search-icon" />
                            <Form.Control
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                        </div>
                    </Col>
                    <Col lg={3} md={6}>
                        <div className="category-wrapper">
                            <FiFilter className="filter-icon" />
                            <Dropdown>
                                <Dropdown.Toggle variant="light" id="category-dropdown">
                                    {selectedCategory}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {categories.map((category) => (
                                        <Dropdown.Item
                                            key={category}
                                            onClick={() => handleCategoryChange(category)}
                                            active={category === selectedCategory}
                                        >
                                            {category}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Col>
                    <Col lg={5} md={12}>
                        <Row className="g-2">
                            <Col>
                                <Form.Control
                                    type="number"
                                    name="min"
                                    value={priceRange[0]}
                                    onChange={handlePriceChange}
                                    placeholder="Min Price"
                                    className="price-input"
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    name="max"
                                    value={priceRange[1]}
                                    onChange={handlePriceChange}
                                    placeholder="Max Price"
                                    className="price-input"
                                />
                            </Col>
                            <Col xs="auto">
                                <Button 
                                    variant="primary"
                                    onClick={() => applyFilters(searchQuery, selectedCategory, priceRange)}
                                    className="apply-filter-btn"
                                >
                                    Apply Filter
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* Products Grid */}
            <Container className="products-grid">
                {loading ? (
                    <div className="loading-container">
                        <Spinner animation="border" role="status" />
                        <p>Loading products...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                ) : filteredProducts.length === 0 ? (
                    <Alert variant="info" className="text-center">
                        No products found matching your criteria.
                    </Alert>
                ) : (
                    <Row className="g-4">
                        {filteredProducts.map((product) => (
                            <Col key={product._id} lg={3} md={4} sm={6}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="product-card">
                                        <div className="product-image-container">
                                            <Card.Img
                                                variant="top"
                                                src={product.image || "/assets/product-placeholder.jpg"}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                            <div className="product-overlay">
                                                <Button
                                                    variant="light"
                                                    className="view-details-btn"
                                                    onClick={() => navigate(`/products/${product._id}`)}
                                                >
                                                    <FiShoppingBag />
                                                </Button>
                                            </div>
                                        </div>
                                        <Card.Body>
                                            <div className="text-center">
                                                <Badge 
                                                    bg="secondary" 
                                                    className="category-badge" 
                                                    title={product.category}
                                                >
                                                    {product.category?.length > 12 
                                                        ? `${product.category.substring(0, 12)}...` 
                                                        : product.category}
                                                </Badge>
                                            </div>
                                            <Card.Title 
                                                className="product-title"
                                                title={product.name}
                                            >
                                                {product.name}
                                            </Card.Title>
                                            <div className="product-footer">
                                                <span className="product-price">
                                                    ₹{product.price?.toFixed(2)}
                                                </span>
                                                <Button
                                                    variant="primary"
                                                    className="add-to-cart-btn"
                                                    onClick={() => navigate(`/products/${product._id}`)}
                                                >
                                                    <FiShoppingBag />
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            <Footer />
        </motion.div>
    );
}

export default Products;
