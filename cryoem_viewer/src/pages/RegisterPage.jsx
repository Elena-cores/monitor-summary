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
        const { username, email, password } = formData;


        // frontend validation. email must be valid, password must be at least 6 characters and include both uppercase and lowercase letters
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

        if (!emailRegex.test(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!passwordRegex.test(password)) {
            newErrors.password =
                "Password must be at least 6 characters and include both uppercase and lowercase letters";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // if it passes validation, call the register function in backend
        const result = await register(formData);
        if (!result.success) {
            const msg = typeof result.error === 'string' ? result.error : 'Registration failed';
            setErrors({ global: msg });
        } else {
            setErrors({});
            alert("User created successfully! Please login.");
            navigate('/login', { replace: true });
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
            <p className="form-switch">Already have an account? <Link to="/login">login</Link></p>
            {errors.global && typeof errors.global === 'string' && (
                <p className="form-error global-error">{errors.global}</p>
            )}
        </div>
    );
};

export default RegisterPage;
