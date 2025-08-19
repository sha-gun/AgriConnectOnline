import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../services/api';
import axios from 'axios';
import { 
    FaUsers, 
    FaShoppingBag, 
    FaRupeeSign, 
    FaBox,
    FaClock,
    FaUserCircle,
    FaArrowUp,
    FaArrowDown,
    FaSync,
    FaExclamationCircle
} from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './AdminDashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`
            };

            setRefreshing(true);

            // Fetch stats
            const statsResponse = await axios.get(`${API_URL}/admin/stats`, { headers });
            setStats(statsResponse.data);

            // Fetch recent orders
            const ordersResponse = await axios.get(`${API_URL}/admin/orders/recent`, { headers });
            setRecentOrders(ordersResponse.data);

            // Fetch recent users
            const usersResponse = await axios.get(`${API_URL}/admin/users/recent`, { headers });
            setRecentUsers(usersResponse.data);

            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // Set up auto-refresh every 5 minutes
        const interval = setInterval(fetchDashboardData, 300000);
        return () => clearInterval(interval);
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Revenue Overview',
                font: {
                    size: 14,
                    weight: '500'
                },
                color: '#2c3345',
                padding: 20
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e5e9ef'
                },
                ticks: {
                    callback: function(value) {
                        return '₹' + value.toLocaleString();
                    },
                    color: '#6b7280',
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    const chartData = {
        labels: stats?.dailyRevenue?.map(item => new Date(item.date).toLocaleDateString()) || [],
        datasets: [
            {
                label: 'Revenue',
                data: stats?.dailyRevenue?.map(item => item.amount) || [],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.3,
                fill: true
            },
        ],
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#f5f7fa' }}>
                <Spinner animation="border" role="status" style={{ color: '#4f46e5' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    const calculateOrderTotal = (order) => {
        const itemsTotal = order.items.reduce((total, item) => {
            return total + (item.product.price * item.qty);
        }, 0);
        return itemsTotal + (order.shippingFee || 0);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Container fluid className="dashboard-container">
                <Card className="dashboard-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="dashboard-title">Dashboard Overview</h2>
                            <p className="dashboard-subtitle">Welcome back! Here is your business summary</p>
                        </div>
                        <Button 
                            className="refresh-button"
                            onClick={fetchDashboardData}
                            disabled={refreshing}
                        >
                            <FaSync className={refreshing ? 'fa-spin' : ''} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </div>
                </Card>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="alert alert-danger"
                        >
                            <FaExclamationCircle />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Cards */}
                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <Card className="dashboard-card">
                            <div className="stats-card">
                                <div className="stats-icon users">
                                    <FaUsers />
                                </div>
                                <h6 className="stats-label">Total Users</h6>
                                <h3 className="stats-value">{stats?.totalUsers?.toLocaleString() || 0}</h3>
                                {stats?.userGrowth && (
                                    <div className={`growth-indicator ${stats.userGrowth >= 0 ? 'positive' : 'negative'}`}>
                                        {stats.userGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                        <span>{Math.abs(stats.userGrowth)}%</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="dashboard-card">
                            <div className="stats-card">
                                <div className="stats-icon orders">
                                    <FaShoppingBag />
                                </div>
                                <h6 className="stats-label">Total Orders</h6>
                                <h3 className="stats-value">{stats?.totalOrders?.toLocaleString() || 0}</h3>
                                {stats?.orderGrowth && (
                                    <div className={`growth-indicator ${stats.orderGrowth >= 0 ? 'positive' : 'negative'}`}>
                                        {stats.orderGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                        <span>{Math.abs(stats.orderGrowth)}%</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="dashboard-card">
                            <div className="stats-card">
                                <div className="stats-icon revenue">
                                    <FaRupeeSign />
                                </div>
                                <h6 className="stats-label">Total Revenue</h6>
                                <h3 className="stats-value">₹{stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</h3>
                                {stats?.revenueGrowth && (
                                    <div className={`growth-indicator ${stats.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                                        {stats.revenueGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                        <span>{Math.abs(stats.revenueGrowth)}%</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="dashboard-card">
                            <div className="stats-card">
                                <div className="stats-icon products">
                                    <FaBox />
                                </div>
                                <h6 className="stats-label">Total Products</h6>
                                <h3 className="stats-value">{stats?.totalProducts?.toLocaleString() || 0}</h3>
                                {stats?.productGrowth && (
                                    <div className={`growth-indicator ${stats.productGrowth >= 0 ? 'positive' : 'negative'}`}>
                                        {stats.productGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                        <span>{Math.abs(stats.productGrowth)}%</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Revenue Chart */}
                <Card className="dashboard-card mb-4">
                    <div className="chart-container">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </Card>

                <Row className="g-4">
                    {/* Recent Orders */}
                    <Col lg={7}>
                        <Card className="dashboard-card table-card">
                            <div className="table-header">
                                <div className="table-title">
                                    <FaClock />
                                    Recent Orders
                                </div>
                                <Badge pill className="badge-pill">
                                    {recentOrders.length} orders
                                </Badge>
                            </div>
                            <div className="table-responsive">
                                {recentOrders.length > 0 ? (
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Status</th>
                                                <th>Total</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map(order => (
                                                <tr key={order._id}>
                                                    <td>#{order._id.slice(-6)}</td>
                                                    <td>{order.name}</td>
                                                    <td>
                                                        <Badge bg={
                                                            order.status === 'Delivered' ? 'success' :
                                                            order.status === 'Processing' ? 'warning' :
                                                            order.status === 'Cancelled' ? 'danger' : 'info'
                                                        } className="status-badge">
                                                            {order.status}
                                                        </Badge>
                                                    </td>
                                                    <td>₹{calculateOrderTotal(order).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="empty-state">
                                        <FaShoppingBag />
                                        <h5>No Recent Orders</h5>
                                        <p>New orders will appear here</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>

                    {/* Recent Users */}
                    <Col lg={5}>
                        <Card className="dashboard-card table-card">
                            <div className="table-header">
                                <div className="table-title">
                                    <FaUserCircle />
                                    Recent Users
                                </div>
                                <Badge pill className="badge-pill">
                                    {recentUsers.length} users
                                </Badge>
                            </div>
                            <div className="table-responsive">
                                {recentUsers.length > 0 ? (
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Role</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentUsers.map(user => (
                                                <tr key={user._id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="user-avatar">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="user-info">
                                                                <div className="user-name">{user.name}</div>
                                                                <div className="user-email">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Badge bg={user.role === 'admin' ? 'danger' : 'info'} className="status-badge">
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="empty-state">
                                        <FaUsers />
                                        <h5>No Recent Users</h5>
                                        <p>New users will appear here</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
}

export default AdminDashboard;
