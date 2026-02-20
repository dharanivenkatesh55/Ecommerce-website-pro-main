import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');

    const [reviews, setReviews] = useState<any[]>([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews/${id}`);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setMainImage(res.data.images[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
        fetchReviews();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        alert('Added to cart!');
    };

    const handleBuyNow = () => {
        addToCart(product);
        navigate('/cart');
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/reviews', { ...newReview, productId: id });
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
            alert('Review submitted!');
        } catch (err) {
            alert('Please login to submit a review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div></div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <div className="container mx-auto p-4 md:p-10">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 font-semibold transition">
                <span className="mr-2">←</span> Back to Shopping
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                {/* Images */}
                <div className="space-y-6">
                    <div className="aspect-square bg-white rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 p-6 md:p-8 flex items-center justify-center">
                        <img
                            src={mainImage ? `https://ecommerce-website-pro-main.onrender.com${mainImage}` : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80'}
                            alt={product.name}
                            className="w-full h-full object-contain transform hover:scale-105 transition duration-700"
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img: string, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition ${mainImage === img ? 'border-blue-600' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <img src={`https://ecommerce-website-pro-main.onrender.com${img}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center">
                    <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-4">{product.brand || 'Premium Edition'}</span>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">{product.name}</h1>

                    <div className="flex items-center space-x-4 mb-8">
                        <span className="text-3xl md:text-4xl font-black text-blue-600 tracking-tighter">₹{product.price}</span>
                        <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                        <span className={`font-bold text-sm md:text-base ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </span>
                    </div>

                    <p className="text-gray-500 text-lg leading-relaxed mb-10 border-l-4 border-blue-100 pl-6">
                        {product.description || 'No description provided for this premium item. Elevate your lifestyle with our curated collection.'}
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-5 bg-blue-600 text-white rounded-full font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="w-full py-5 border-2 border-gray-900 text-gray-900 rounded-full font-black text-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
                        >
                            Buy Now
                        </button>
                    </div>

                    <div className="mt-12 pt-12 border-t border-gray-100 grid grid-cols-3 gap-8">
                        <Benefit icon="🛡️" title="Secure" />
                        <Benefit icon="🚚" title="Fast Shipping" />
                        <Benefit icon="♻️" title="Returns" />
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-3xl font-black mb-8">Customer Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
                    ) : (
                        <div className="space-y-8">
                            {reviews.map((rev) => (
                                <div key={rev.id} className="bg-gray-50 p-8 rounded-[30px] border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="font-bold text-gray-900">{rev.user_name}</div>
                                        <div className="flex text-yellow-400">
                                            {[...Array(rev.rating)].map((_, i) => <span key={i}>★</span>)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
                                    <div className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        {new Date(rev.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-gray-900 p-10 md:p-12 rounded-[40px] text-white shadow-2xl">
                    <h3 className="text-2xl font-black mb-6">Write a Review</h3>
                    <form onSubmit={submitReview} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Rating</label>
                            <select
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Fair</option>
                                <option value="1">1 - Poor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Your Thoughts</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                required
                                placeholder="What did you love (or not) about this product?"
                                className="w-full bg-gray-800 border-none rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full transition shadow-lg disabled:bg-gray-700"
                        >
                            {submitting ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


const Benefit = ({ icon, title }: { icon: string, title: string }) => (
    <div className="text-center">
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</div>
    </div>
);

export default ProductDetail;
