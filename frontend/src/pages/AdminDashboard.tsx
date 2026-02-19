import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/admin/login');
        }
    }, [navigate]);

    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Admin Dashboard
                </h1>
                <button
                    onClick={() => { localStorage.clear(); navigate('/admin/login'); }}
                    className="mt-4 md:mt-0 px-6 py-2 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 transition-all duration-300 border border-red-200"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AdminCard
                    title="Manage Products"
                    desc="Add, edit, and delete products from your catalog"
                    link="/admin/products"
                    color="bg-blue-500"
                    icon="📦"
                />
                <AdminCard
                    title="Manage Categories"
                    desc="Organize products into distinct categories"
                    link="/admin/categories"
                    color="bg-green-500"
                    icon="📂"
                />
                <AdminCard
                    title="View Orders"
                    desc="Track and process customer orders"
                    link="/admin/orders"
                    color="bg-purple-500"
                    icon="🛒"
                />
                <AdminCard
                    title="Banners & Offers"
                    desc="Promote sales with banners and special offers"
                    link="/admin/banners"
                    color="bg-orange-500"
                    icon="🏷️"
                />
            </div>
        </div>
    );
};

interface CardProps {
    title: string;
    desc: string;
    link: string;
    color: string;
    icon: string;
}

const AdminCard: React.FC<CardProps> = ({ title, desc, link, color, icon }) => (
    <Link to={link} className="group flex flex-col p-6 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${color} text-2xl mb-6 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
            {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{desc}</p>
        <div className="mt-auto flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
            Get Started
            <span className="ml-2">→</span>
        </div>
    </Link>
);

export default AdminDashboard;
