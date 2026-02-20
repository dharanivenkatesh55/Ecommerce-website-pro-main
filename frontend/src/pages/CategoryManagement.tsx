import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Category {
    id: number;
    name: string;
    description: string;
}

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/categories', { name, description });
            setName('');
            setDescription('');
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add category');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Category Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-indigo-600">Add New Category</h2>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Electronics"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                    placeholder="Brief description..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
                            >
                                {loading ? 'Adding...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Name</th>
                                    <th className="px-6 py-4 font-bold">Description</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-50 transition duration-200">
                                            <td className="px-6 py-4 font-semibold text-gray-800">{cat.name}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{cat.description || 'No description'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center text-gray-400">No categories found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;
