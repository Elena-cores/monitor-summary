import { createContext, useContext, useState, useEffect } from 'react';
import { register as apiRegister, login as apiLogin, verifyToken } from '../api/authApi';

const AuthContext = createContext();

// This component provides authentication context to the application
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // to manage loading state
    const [isApiReady, setIsApiReady] = useState(false);    // to manage API readiness state

    // Initialize user state if token exists
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const isValid = await verifyToken(token);
                    if (isValid) {
                        setIsAuthenticated(true);
                        setIsApiReady(true);
                    } else {
                        logout();
                    }
                } catch (error) {
                    logout();
                }
            } else {
                setIsApiReady(true); // If no token, set API as ready
            }
            setIsLoading(false);
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
            setIsAuthenticated(true);
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
            return { success: false,  error: errorMessage  };
        }
    };

    // Function to log in an existing user
    const login = async (credentials) => {
        try {
            const data = await apiLogin(credentials);
            localStorage.setItem('token', data.token);  // Store token in local storage
            setToken(data.token);
            setUser({ id: data.user_id, username: data.username });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            let errorMessage = 'Login failed';
            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = 'Username or password is incorrect';
                } else if (error.response.data && error.response.data.non_field_errors) {
                    errorMessage = error.response.data.non_field_errors.join(' ');
                }
            }
            return { success: false,  error: errorMessage  };
        }
    };

    // Function to log out the current user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);