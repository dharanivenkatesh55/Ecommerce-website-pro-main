import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserProfile: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch profile
        api.get('/auth/profile')
            .then(res => setUser(res.data))
            .catch(err => console.error(err));

        // Fetch orders
        api.get('/orders/my-orders')
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
                setLoading(false);
            });

        // Mock user info from token or backend if we had a /me endpoint
        // For now, let's just use the name if we had it.
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="container mx-auto p-4 md:p-10 min-h-[70vh]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-2">
                        {user ? `Hello, ${user.name}` : 'My Profile'}
                    </h1>
                    <p className="text-gray-500 font-medium">Manage your orders and account settings</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-8 py-3 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-600 hover:text-white transition-all"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Account Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-50">
                        <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-3xl mb-6">👤</div>
                        <h3 className="text-xl font-bold mb-4">Account Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Name</label>
                                <p className="font-bold text-gray-900">{user?.name || 'Loading...'}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Email</label>
                                <p className="font-bold text-gray-900">{user?.email || 'Loading...'}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Status</label>
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">Active Customer</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-black mb-8">Order History</h2>
                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-gray-50 p-20 rounded-[40px] text-center">
                            <div className="text-4xl mb-6">📦</div>
                            <p className="text-gray-400 font-medium mb-8">You haven't placed any orders yet.</p>
                            <Link to="/" className="px-10 py-4 bg-gray-900 text-white font-black rounded-full hover:bg-blue-600 transition">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order.id} className="bg-white p-8 rounded-[30px] shadow-lg shadow-gray-50 border border-gray-100 hover:border-blue-200 transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order ID</div>
                                            <div className="text-lg font-black text-gray-900">#{order.id}</div>
                                        </div>
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</div>
                                            <div className="font-bold text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</div>
                                            <div className="font-black text-sm text-blue-600">₹{order.total_price}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping to</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{order.shipping_address}, {order.city}</div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                                        <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View Details →</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
