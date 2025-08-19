// src/context/AuthContext.jsx

import { createContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        error: null,
    });

    // Safe mount reference
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        const verifyToken = () => {
            const token = localStorage.getItem('token');

            if (!token) {
                if (isMountedRef.current) {
                    setAuthState((prevState) => ({
                        ...prevState,
                        isAuthenticated: false,
                        user: null,
                        isLoading: false,
                        error: null,
                    }));
                }
                return;
            }

            try {
                const decoded = jwtDecode(token);

                if (decoded.exp * 1000 < Date.now()) {
                    console.warn('Token expired');
                    localStorage.removeItem('token');
                    if (isMountedRef.current) {
                        setAuthState({
                            isAuthenticated: false,
                            user: null,
                            isLoading: false,
                            error: 'Session expired. Please login again.',
                        });
                    }
                    return;
                }

                if (isMountedRef.current) {
                    setAuthState({
                        isAuthenticated: true,
                        user: decoded,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (error) {
                console.error('Invalid token:', error.message);
                localStorage.removeItem('token');
                if (isMountedRef.current) {
                    setAuthState({
                        isAuthenticated: false,
                        user: null,
                        isLoading: false,
                        error: 'Invalid token. Please login again.',
                    });
                }
            }
        };

        verifyToken();

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // 🔑 Handle Login
    const login = (token) => {
        try {
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);

            setAuthState({
                isAuthenticated: true,
                user: decoded,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Invalid token during login:', error.message);
            logout();
        }
    };

    // 🔒 Handle Logout
    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
        });
    };

    // 🔄 Refresh Token Logic (Optional)
    const refreshToken = async () => {
        try {
            // eslint-disable-next-line no-undef
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const { token } = await response.json();
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);

            setAuthState({
                isAuthenticated: true,
                user: decoded,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Token refresh failed:', error.message);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

