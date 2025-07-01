import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { register as apiRegister } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');    // Retrieve user data from localStorage
        return storedUser ? JSON.parse(storedUser) : null;  // Initialize user state from localStorage
    });
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    const setAuthToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('token', newToken);
            axios.defaults.headers.common['Authorization'] = `Token ${newToken}`;
            setToken(newToken);
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setToken(null);
            setIsAuthenticated(false);
        }
    };

    const setUserData = (userData) => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } else {
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    // Register a new user
    const register = async (userData) => {
        try {
            const data = await apiRegister(userData);
            setAuthToken(data.token);
            setUser({ id: data.user_id, username: data.username });
            return { success: true };
        } catch (error) {
            let errorMessage = 'Registration failed';
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.username) errorMessage = `Username: ${errorData.username.join(' ')}`;
                else if (errorData.password) errorMessage = `Password: ${errorData.password.join(' ')}`;
                else if (errorData.email) errorMessage = `Email: ${errorData.email.join(' ')}`;
                else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors.join(' ');
            }
            return { success: false, error: errorMessage };
        }
    };

    // Login an existing user
    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login/', credentials);
            const { token, user_id, username } = response.data;

            setAuthToken(token);
            setUser({ id: user_id, username });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            // You can enhance error handling here as needed
            return { success: false, error: 'Username or password is incorrect' };
        }
    };

    // Logout the user
    const logout = () => {
        setAuthToken(null);
        setUserData(null);
    };

    // Verify token on app load to restore session if token valid
    useEffect(() => {
        const verifyAuth = async () => {
            const localToken = localStorage.getItem('token');
            if (localToken) {
                try {
                    // Verificar el token con el backend
                    const response = await axios.get('http://localhost:8000/api/auth/verify-token/', {
                        headers: { 'Authorization': `Token ${localToken}` }
                    });

                    if (response.status === 200) {
                        setAuthToken(localToken);
                        const storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            setUser(JSON.parse(storedUser));
                        }
                    } else {
                        logout();
                    }
                } catch (error) {
                    logout();
                }
            }
            setIsLoading(false);
        };

        verifyAuth();
    }, []);

    if (isLoading) {
        return <p>Loading authentication...</p>; // avoid loading the app before token verification
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
