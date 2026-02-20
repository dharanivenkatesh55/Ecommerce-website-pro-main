import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Offer {
    id: number;
    title: string;
    description: string;
    image_url: string;
    is_active: boolean;
}

const BannerManagement: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await api.get('/offers/admin');
            setOffers(response.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return alert('Please select an image');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('image', image);

            await api.post('/offers', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setTitle('');
            setDescription('');
            setImage(null);
            fetchOffers();
            alert('Banner added successfully!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await api.patch(`/offers/${id}/status`, { is_active: !currentStatus });
            fetchOffers();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this banner?')) return;
        try {
            await api.delete(`/offers/${id}`);
            fetchOffers();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="container mx-auto p-4 md:p-10">
            <h1 className="text-3xl font-black mb-8 text-gray-900">Banners & Offers Management</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Form */}
                <div className="xl:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6 sticky top-24">
                        <h2 className="text-xl font-bold text-blue-600 mb-2">Create New Banner</h2>
                        <p className="text-sm text-gray-400 mb-6">Banners appear on the homepage to promote sales.</p>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Promotion Title</label>
                            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition" placeholder="e.g. Summer Sale 50% Off" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition" rows={3} placeholder="Tell customers about the deal..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
                            <input type="file" required onChange={e => setImage(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition duration-300">
                            {loading ? 'Uploading...' : 'Publish Banner'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="xl:col-span-2 space-y-6">
                    {offers.length === 0 ? (
                        <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center text-gray-400 font-medium">
                            No banners created yet.
                        </div>
                    ) : (
                        offers.map(offer => (
                            <div key={offer.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                                        <img src={`https://ecommerce-website-pro-backend.onrender.com${offer.image_url}`} alt={offer.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${offer.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {offer.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm line-clamp-2">{offer.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-50">
                                            <button
                                                onClick={() => toggleStatus(offer.id, offer.is_active)}
                                                className={`text-sm font-bold ${offer.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                                            >
                                                {offer.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(offer.id)}
                                                className="text-sm font-bold text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BannerManagement;
