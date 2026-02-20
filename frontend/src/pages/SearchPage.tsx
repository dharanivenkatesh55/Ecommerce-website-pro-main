import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    main_image: string;
    brand: string;
    category_name: string;
}

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        api.get(`/products?search=${query}`)
            .then(res => {
                setProducts(res.data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [query]);

    return (
        <div className="bg-white min-h-[70vh]">
            <header className="bg-gray-50 py-12 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 tracking-tighter">Search Results</h1>
                    <p className="text-gray-500 font-medium">Results for "<span className="text-blue-600 italic">{query}</span>"</p>
                </div>
            </header>

            <div className="container mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-12">
                    <p className="text-gray-500 font-medium">{products.length} items found</p>
                    <Link to="/" className="text-blue-600 font-bold hover:underline">Continue Shopping</Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {products.map((product) => (
                            <div key={product.id} className="group relative">
                                <Link to={`/product/${product.id}`} className="block">
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100 mb-6 group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                                        <img
                                            src={product.main_image ? `https://ecommerce-website-pro-backend.onrender.com${product.main_image}` : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-gray-900 shadow-sm uppercase tracking-widest">
                                            {product.category_name}
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(product);
                                                    alert('Added to cart!');
                                                }}
                                                className="px-6 py-3 bg-white text-black font-black rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl hover:bg-blue-600 hover:text-white"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition tracking-tight">{product.name}</h3>
                                    <p className="text-sm text-gray-400 mb-2 uppercase tracking-widest">{product.brand}</p>
                                    <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{product.price}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
                        <div className="text-6xl mb-6">🔍</div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4">No matches found</h2>
                        <p className="text-gray-400 max-w-sm mx-auto mb-10">We couldn't find anything for your search. Try different keywords or browse our categories.</p>
                        <Link to="/categories" className="px-10 py-4 bg-gray-900 text-white rounded-full font-black hover:bg-blue-600 transition shadow-xl shadow-blue-100">Browse Categories</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
