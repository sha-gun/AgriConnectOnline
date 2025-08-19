// src/pages/AdminUsers.jsx

import { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner, Badge, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api';
import axios from 'axios';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    
    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        role: ''
    });

    // Fetch all users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await axios.get(`${API_URL}/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data) {
                    // Handle both array and object responses
                    const userData = response.data?.users || response.data;
                    if (Array.isArray(userData)) {
                        setUsers(userData);
                    } else {
                        console.error('Invalid response format:', response.data);
                        throw new Error('Invalid data format received from server');
                    }
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    setError(err.response?.data?.message || err.message || 'Failed to fetch users');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'user'
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/admin/users/${selectedUser._id}`,
                editFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setUsers(users.map(user => 
                    user._id === selectedUser._id ? { ...user, ...editFormData } : user
                ));
                setMessage('User updated successfully');
                setShowEditModal(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update user');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/admin/users/${selectedUser._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setMessage('User deleted successfully');
                setUsers(users.filter(user => user._id !== selectedUser._id));
                setShowDeleteModal(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to delete user');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="my-5">
                <h2 className="mb-4 text-center">Manage Users</h2>
                {message && <Alert variant="success" dismissible onClose={() => setMessage(null)}>{message}</Alert>}
                {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : users.length > 0 ? (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name || 'N/A'}</td>
                                    <td>
                                        <a href={`mailto:${user.email}`}>{user.email || 'N/A'}</a>
                                    </td>
                                    <td>
                                        <Badge bg={user.role === 'admin' ? 'success' : 'secondary'}>
                                            {user.role || 'user'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="light" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <i className="fas fa-edit"></i> Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(user)}
                                            disabled={user.role === 'admin'}
                                        >
                                            <i className="fas fa-trash"></i> Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">No users found</Alert>
                )}

                {/* Edit User Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete the user {selectedUser?.name}? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete User
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </motion.div>
    );
}

export default AdminUsers;
