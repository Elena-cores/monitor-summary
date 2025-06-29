import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import '../assets/registerPage.css';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    // state to manage form data and errors
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const { register } = useAuth();

    // update the formData state with the input values
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // handle form submission, call the register function from AuthContext
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData);
        if (!result.success) {
            setErrors(result.error);
         } else {
            navigate('/'); // redirect to home page on successful registration
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                    {errors.username && <p className="form-error">{errors.username}</p>}
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
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
                    {errors.password && <p className="form-error">{errors.password}</p>}
                </div>
                <button type="submit" className="form-button">
                    Register
                </button>
            </form> 
            <p className="form-switch">Already have an account? <Link to="/login"></Link></p>
        </div>
    );
};

export default RegisterPage;
