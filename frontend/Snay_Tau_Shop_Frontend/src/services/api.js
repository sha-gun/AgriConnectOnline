import axios from 'axios';
// export const API_URL = 'https://thesnay-snay-tau-shop.hf.space/';
export const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://thesnay-snay-tau-shop.hf.space/api'
export const register = (data) => axios.post(`${API_URL}/auth/register`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);

export const fetchProducts = () => axios.get(`${API_URL}/products`);
export const fetchProductById = (id) => axios.get(`${API_URL}/products/${id}`);
export const createProduct = (data) => axios.post(`${API_URL}/products`, data);
export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);

export const createOrder = (data) => axios.post(`${API_URL}/orders`, data);
export const fetchMyOrders = () => axios.get(`${API_URL}/orders/myorders`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
export const fetchAllOrders = () => axios.get(`${API_URL}/orders`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
export const updateOrderStatus = (id, data) => axios.put(`${API_URL}/orders/${id}`, data, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
