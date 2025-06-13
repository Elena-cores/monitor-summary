import { createContext, useContext, useState, useEffect } from 'react';
import { register as apiRegister, login as apiLogin, verifyToken } from '../api/authApi';

const AuthContext = createContext();

// This component provides authentication context to the application
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    // Initialize user state if token exists
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                const isValid = await verifyToken(token);
                if (!isValid) logout();
            }
        };
        checkAuth();
    }, [token]);
    // Function to register a new user
    const register = async (userData) => {
        try {
            const data = await apiRegister(userData);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser({ id: data.user_id, username: data.username });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    // Function to log in an existing user
    const login = async (credentials) => {
        try {
            const data = await apiLogin(credentials);
            localStorage.setItem('token', data.token);  // Store token in local storage
            setToken(data.token);
            setUser({ id: data.user_id, username: data.username });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    // Function to log out the current user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);