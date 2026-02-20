import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password, role: 'customer' });
            navigate('/login');
            alert('Registration successful! Please login.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 bg-gray-50">
            <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-[40px] shadow-2xl shadow-blue-100 border border-gray-100">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Join Us</h2>
                    <p className="mt-4 text-gray-500 font-medium">Create your shopper account today</p>
                </div>
                <form className="mt-10 space-y-6" onSubmit={handleRegister}>
                    {error && (
                        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100 font-bold text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Ram"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full Natural selection px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-5 text-white bg-blue-600 rounded-full hover:bg-black transition-all duration-500 font-black text-lg shadow-xl shadow-blue-200"
                    >
                        Create Account
                    </button>
                    <div className="text-center mt-8">
                        <Link to="/login" className="text-sm font-bold text-blue-600 hover:underline transition-colors">
                            Already have an account? Log In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
