import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiArrowLeft, FiMaximize2 } from "react-icons/fi";
import { API_URL } from "../services/api";
import "./ProductPage.css";

function ProductPage() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showZoom, setShowZoom] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const data = await response.json();
                setProduct(data);
                
                if (data?.sizes && Array.isArray(data.sizes)) {
                    const validSizes = data.sizes.filter(size => 
                        typeof size === 'string' || typeof size.size === 'string'
                    );
                    if (validSizes.length > 0) {
                        setSelectedSize(typeof validSizes[0] === 'string' ? 
                            validSizes[0] : validSizes[0].size);
                    } else {
                        setSelectedSize('Standard');
                    }
                } else {
                    setSelectedSize('Standard');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            if (!selectedSize && product.sizes?.length > 0) {
                alert("Please select a size");
                return;
            }

            setAddingToCart(true);
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to add items to your cart");
                return;
            }

            const response = await fetch(`${API_URL}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product._id,
                    qty,
                    size: selectedSize,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            alert(`Successfully added ${qty} x ${product.name} to your cart!`);
        } catch (err) {
            alert(err.message || "Failed to add product to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const renderSizeOptions = () => {
        if (!product?.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
            return <option value="Standard">Standard Size</option>;
        }

        return product.sizes.map((size, index) => {
            const sizeValue = typeof size === 'string' ? size : size.size;
            return (
                <option key={index} value={sizeValue}>
                    {sizeValue}
                </option>
            );
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status" />
                <span>Loading product details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert variant="danger">
                    {error}
                    <Button 
                        variant="link" 
                        className="d-block mt-3"
                        onClick={() => navigate('/products')}
                    >
                        <FiArrowLeft /> Back to Products
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <div className="product-page">
            <Container>
                <Button
                    variant="primary"
                    className="back-button mb-4"
                    onClick={() => navigate('/products')}
                >
                    <FiArrowLeft /> Back to Products
                </Button>

                <div className="product-content">
                    <Row>
                        <Col md={6} className="product-image-section">
                            <div 
                                className="product-image-wrapper"
                                onClick={() => setShowZoom(true)}
                            >
                                <img
                                    src={product.image || "/assets/product-placeholder.jpg"}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="zoom-icon">
                                    <FiMaximize2 size={24} />
                                </div>
                            </div>
                        </Col>

                        <Col md={6} className="product-details">
                            <div className="product-info">
                                <h1 className="product-title">{product.name}</h1>
                                <div className="product-meta">
                                    <span className="product-category">{product.category}</span>
                                    <span className="product-price">₹{product.price?.toFixed(2)}</span>
                                </div>
                                <p className="product-description">{product.description}</p>
                                
                                <div className="product-actions">
                                    <div className="selectors-container">
                                        <div className="size-selector">
                                            <label htmlFor="size-select">Size:</label>
                                            {product && (
                                                <select 
                                                    id="size-select"
                                                    value={selectedSize || ''}
                                                    onChange={(e) => setSelectedSize(e.target.value)}
                                                    disabled={!product || product.stock === 0}
                                                >
                                                    {!selectedSize && <option value="">Select Size</option>}
                                                    {renderSizeOptions()}
                                                </select>
                                            )}
                                        </div>

                                        <div className="quantity-selector">
                                            <select 
                                                value={qty} 
                                                onChange={(e) => setQty(Number(e.target.value))}
                                                disabled={product.stock === 0}
                                            >
                                                <option value="" disabled>Qty</option>
                                                {[...Array(Math.min(10, product.stock || 0))].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="stock-status">
                                        {product.stock > 0 ? (
                                            <span className="in-stock">In Stock ({product.stock})</span>
                                        ) : (
                                            <span className="out-of-stock">Out of Stock</span>
                                        )}
                                    </div>

                                    <Button 
                                        className="add-to-cart-btn"
                                        disabled={product.stock === 0 || addingToCart}
                                        onClick={handleAddToCart}
                                    >
                                        {addingToCart ? (
                                            <>
                                                <Spinner animation="border" size="sm" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <FiShoppingBag />
                                                Add to Cart
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            <div 
                className={`image-zoom-modal ${showZoom ? 'show' : ''}`}
                onClick={() => setShowZoom(false)}
            >
                <img
                    src={product.image || "/assets/product-placeholder.jpg"}
                    alt={product.name}
                    className="zoomed-image"
                />
            </div>
        </div>
    );
}

export default ProductPage;
