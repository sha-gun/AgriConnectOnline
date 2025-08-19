// src/pages/Dashboard.jsx

import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Ensure you have corresponding CSS for styling

function Dashboard() {
    const { isAuthenticated, user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Welcome Section */}
            <header className="dashboard-header">
                <h1>Welcome, {user?.name || 'User'}!</h1>
                <p>Your one-stop shop for all farming needs.</p>
            </header>

            {/* About Section */}
            <section className="dashboard-section about-shop">
                <h2>About Kisaan Krishi Seva</h2>
                <p>
                    At <strong>Kisaan Krishi Seva</strong>, we provide high-quality farming tools, 
                    machinery, and expert advice to empower farmers and enhance productivity. 
                    From tractor parts to advanced threshers, we have got it all.
                </p>
            </section>

            {/* Product Highlights */}
            <section className="dashboard-section product-highlights">
                <h2>Our Products</h2>
                <div className="product-cards">
                    <div className="product-card">
                        <h3>🚜 Tractor Parts</h3>
                        <p>High-quality, durable tractor spare parts for smooth operations.</p>
                    </div>
                    <div className="product-card">
                        <h3>🌾 Threshers</h3>
                        <p>Efficient threshers designed to optimize your harvest yield.</p>
                    </div>
                    <div className="product-card">
                        <h3>🛠️ Tools & Equipment</h3>
                        <p>A wide range of farming tools to simplify everyday tasks.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="dashboard-section call-to-action">
                <h2>Ready to Explore?</h2>
                <p>Browse our product catalog or contact us for personalized support.</p>
                <button onClick={() => navigate('/products')} className="cta-button">Explore Products</button>
            </section>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>&copy; {new Date().getFullYear()} Kisaan Krishi Seva. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default Dashboard;
