import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    category_name: string;
    brand: string;
}

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [brand, setBrand] = useState('');
    const [stock, setStock] = useState('0');
    const [images, setImages] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.products);
        } catch (err) { console.error(err); }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category_id', categoryId);
            formData.append('brand', brand);
            formData.append('stock', stock);

            if (images) {
                Array.from(images).forEach((image) => {
                    formData.append('images', image);
                });
            }

            await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Reset form
            setName(''); setDescription(''); setPrice(''); setCategoryId(''); setBrand(''); setStock('0'); setImages(null);
            fetchProducts();
            alert('Product added successfully!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="container mx-auto p-4 md:p-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Product Management</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Form */}
                <div className="xl:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-5">
                        <h2 className="text-xl font-bold text-blue-600 mb-4">Add New Product</h2>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Name</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-xl" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Price (₹)</label>
                                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Stock</label>
                                <input type="number" required value={stock} onChange={e => setStock(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-xl" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Category</label>
                            <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-xl">
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Brand</label>
                            <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-xl" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-xl" rows={3}></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Images (Max 5)</label>
                            <input type="file" multiple onChange={e => setImages(e.target.files)} className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition duration-300">
                            {loading ? 'Processing...' : 'Add Product'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{p.name}</div>
                                            <div className="text-xs text-gray-400">{p.brand}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{p.category_name}</td>
                                        <td className="px-6 py-4 font-bold text-indigo-600">₹{p.price}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
