// ...existing code...
import jwtDecode from 'jwt-decode';

// Authentication utility functions
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

export const login = (token) => {
    localStorage.setItem('token', token);
};

export const logout = () => {
    localStorage.removeItem('token');
};

