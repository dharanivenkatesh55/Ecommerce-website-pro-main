import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role: 'admin' // Force role to admin for this page
            });
            setSuccess('Admin account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/admin/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-6 py-20 flex justify-center">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="bg-blue-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl font-black italic shadow-xl shadow-blue-200">E</div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Create Admin</h1>
                    <p className="text-gray-400 font-medium">Register a new administrator account</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100">{error}</div>}
                {success && <div className="bg-green-50 text-green-500 p-4 rounded-2xl mb-6 text-sm font-bold border border-green-100">{success}</div>}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-4">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:outline-none transition font-medium"
                            placeholder="Dharani Venkatesh"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-4">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:outline-none transition font-medium"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-4">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:outline-none transition font-medium"
                            placeholder="••••••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100"
                    >
                        Register Admin
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 font-medium">
                    Already have an account? <Link to="/admin/login" className="text-blue-600 font-black hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default AdminRegister;
