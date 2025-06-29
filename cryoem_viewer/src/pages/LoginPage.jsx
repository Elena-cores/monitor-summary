import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/loginPage.css'; 

const LoginPage = () => {
    const navigate = useNavigate();
    // state to manage form data and errors
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState({});
    const { login } = useAuth();

    // update the formData state with the input values
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    // handle form submission, call the login function from AuthContext
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData);
        if (!result.success) {
            setError(result.error);
         } else {
            navigate('/'); // redirect to home page on successful login
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">User</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                    {error.username && <p className="form-error">{error.username}</p>}
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                    {error.password && <p className="form-error">{error.password}</p>}
                </div>
                <button type="submit" className="form-button">
                    Login
                </button>
            </form>
             <p className="form-switch">¿You don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
};

export default LoginPage;
