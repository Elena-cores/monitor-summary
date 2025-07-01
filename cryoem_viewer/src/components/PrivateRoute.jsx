import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <p>Loading authentication...</p>;  // block rendering until authentication state is determined
    }

    // if user is authenticated, render the children, otherwise redirect to login
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;