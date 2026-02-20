import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.role === 'admin') {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                navigate('/admin');
            } else {
                setError('Access denied: You are not an admin.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
                    <p className="mt-2 text-sm text-gray-600">Access the admin panel to manage your store</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 font-bold tracking-wide"
                    >
                        Sign in to Dashboard
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/admin/register" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Need to register a new admin?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
