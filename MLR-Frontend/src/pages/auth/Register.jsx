import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { patterns, messages } from '../../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    } else if (!patterns.name.test(formData.firstName)) {
      newErrors.firstName = messages.firstName;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    } else if (!patterns.name.test(formData.lastName)) {
      newErrors.lastName = messages.lastName;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!patterns.email.test(formData.email)) {
      newErrors.email = messages.email;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!patterns.password.test(formData.password)) {
      newErrors.password = messages.password;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = messages.confirmPassword;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const result = await register(registerData);
      if (result.success) {
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const backendErrors = {};
        const validationErrors = error.response.data.errors;
        
        Object.keys(validationErrors).forEach(field => {
          const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
          backendErrors[fieldName] = validationErrors[field][0];
        });
        setErrors(backendErrors);
      } else {
        setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Create Account</h3>

              {serverError && (
                <div className="alert alert-danger mb-4">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    className={`form-input ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter First Name"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    className={`form-input ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-input ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars, 1 digit"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-input ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;