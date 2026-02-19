import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    main_image: string;
    brand: string;
}

interface Offer {
    id: number;
    title: string;
    description: string;
    image_url: string;
}

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        // Fetch products
        api.get('/products')
            .then(res => {
                setProducts(res.data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // Fetch categories
        api.get('/categories')
            .then(res => setCategories(res.data || []))
            .catch(err => console.error(err));

        // Fetch active offers
        api.get('/offers')
            .then(res => setOffers(res.data || []))
            .catch(err => console.error(err));
    }, []);

    const activeOffer = offers.length > 0 ? offers[0] : null;

    const getCategoryImage = (name: string) => {
        const images: { [key: string]: string } = {
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
            'Fashion': 'https://images.pexels.com/photos/8306365/pexels-photo-8306365.jpeg?auto=compress&cs=tinysrgb&w=500',
            'Men Centric': 'https://images.pexels.com/photos/5264900/pexels-photo-5264900.jpeg?auto=compress&cs=tinysrgb&w=500',
            'Women centric Fashion': 'https://images.pexels.com/photos/8306365/pexels-photo-8306365.jpeg?auto=compress&cs=tinysrgb&w=500',
            'Home & Decor': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
            'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        };
        return images[name] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
    };

    return (
        <div className="bg-white">
            {/* ... rest of hero ... */}
            <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden bg-gray-900 text-white">
                {activeOffer ? (
                    <img
                        src={`http://localhost:5000${activeOffer.image_url}`}
                        alt={activeOffer.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10 opacity-70"></div>
                )}
                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-2xl">
                        <span className="inline-block px-4 py-1 mb-6 bg-blue-600 text-white text-sm font-bold rounded-full uppercase tracking-widest">{activeOffer ? 'Limited Offer' : 'Spring Collection 2026'}</span>
                        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
                            {activeOffer ? activeOffer.title : <>Define Your <span className="text-blue-500 italic">Style</span></>}
                        </h1>
                        <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-lg">
                            {activeOffer ? activeOffer.description : 'Experience the next generation of e-commerce. Premium quality meets exceptional service.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/categories" className="px-10 py-4 bg-white text-black text-center font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105">Shop Now</Link>
                            <Link to="/about" className="px-10 py-4 border-2 border-white text-white text-center font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300">Learn More</Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Fashion Section */}
            <section className="py-12 md:py-24 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="relative rounded-[30px] md:rounded-[60px] overflow-hidden bg-gray-900 group">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=75&auto=format"
                            alt="Fashion Collection"
                            className="w-full h-[400px] md:h-[500px] object-cover opacity-60 group-hover:scale-105 transition duration-1000"
                        />

                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-12">
                            <span className="text-blue-400 font-black tracking-[0.3em] uppercase text-sm mb-4 md:mb-6">Exclusive Release</span>
                            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-8 max-w-3xl leading-tight">The Art of <br /><span className="text-blue-500 italic">Modern</span> Elegance</h2>
                            <p className="text-gray-300 text-base md:text-lg mb-8 md:mb-10 max-w-xl hidden sm:block">Discover our curated collection of high-end fashion pieces designed for those who demand excellence in every detail.</p>
                            <Link to="/categories" className="px-10 py-4 md:px-12 md:py-5 bg-white text-black font-black rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-2xl">Explore Collection</Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Categories Overview */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2">Shop by Category</h2>
                            <p className="text-gray-500">Explore our diverse range of premium products</p>
                        </div>
                        <Link to="/categories" className="text-blue-600 font-bold hover:underline">View All Categories</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.slice(0, 4).map(cat => (
                            <CategoryCard key={cat.id} name={cat.name} img={getCategoryImage(cat.name)} />
                        ))}
                    </div>
                </div>
            </section>



            {/* Product Listing */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-black text-gray-900 mb-16 text-center">Featured Products</h2>

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
                                                src={product.main_image ? `http://localhost:5000${product.main_image}` : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'}
                                                alt={product.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-gray-900 shadow-sm">
                                                NEW
                                            </div>

                                            {/* Hover Action */}
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
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-xl text-gray-400 font-medium mb-4">No products available yet.</p>
                            <p className="text-sm text-gray-500 mb-8">Administrators can add products through the dashboard.</p>
                            <Link to="/admin/login" className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold">Manage Store</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-blue-600 py-20">
                <div className="container mx-auto px-6 text-center text-white">
                    <h2 className="text-4xl font-black mb-4">Stay in the Loop</h2>
                    <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg">Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input type="email" placeholder="Your email address" className="flex-grow px-6 py-4 rounded-full text-black outline-none focus:ring-4 focus:ring-blue-300" />
                        <button className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition">Join</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const CategoryCard = ({ name, img }: { name: string, img: string }) => (
    <Link to={`/collection/${name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`} className="relative h-64 md:h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg block">
        <img src={img} alt={name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
            <h3 className="text-xl md:text-2xl font-black mb-1 md:mb-2">{name}</h3>
            <p className="text-xs md:text-sm opacity-80 uppercase tracking-widest transform translate-y-4 md:translate-y-4 group-hover:translate-y-0 transition-all duration-300">Browse Collection</p>
        </div>
    </Link>
);



export default HomePage;
