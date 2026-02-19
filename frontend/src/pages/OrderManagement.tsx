import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Order {
    id: number;
    customer_name: string;
    customer_email: string;
    total_price: number;
    status: string;
    created_at: string;
    shipping_address: string;
    city: string;
    zip_code: string;
}

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/orders/${id}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-10">
            <h1 className="text-3xl font-black mb-8 text-gray-900">Order Management</h1>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl text-center text-gray-400 font-medium">
                    No orders found.
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold">{order.customer_name}</div>
                                        <div className="text-xs text-gray-400">{order.customer_email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-blue-600">₹{order.total_price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                    'bg-orange-100 text-orange-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <select
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            value={order.status}
                                            className="text-sm border-none bg-gray-100 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
