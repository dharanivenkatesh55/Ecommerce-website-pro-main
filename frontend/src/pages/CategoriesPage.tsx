import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Category {
    id: number;
    name: string;
    description: string;
}

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/categories')
            .then(res => {
                setCategories(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getCategoryImage = (name: string) => {
        const images: { [key: string]: string } = {
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
            'Fashion': 'https://images.pexels.com/photos/8030176/pexels-photo-8030176.jpeg',
            'Men Centric': 'https://images.pexels.com/photos/5264900/pexels-photo-5264900.jpeg',
            'Women centric Fashion': 'https://images.pexels.com/photos/8306365/pexels-photo-8306365.jpeg',
            'Home & Decor': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
            'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        };
        return images[name] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
    };

    return (
        <div className="bg-white min-h-screen">
            <header className="bg-gray-900 py-16 md:py-24 text-center">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-4">All Categories</h1>
                    <p className="text-gray-400 text-lg">Browse our complete collection by department</p>
                </div>
            </header>

            <div className="container mx-auto px-6 py-20">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/collection/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                                className="group relative h-80 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-200/50"
                            >
                                <img
                                    src={getCategoryImage(cat.name)}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10">
                                    <h2 className="text-3xl font-black text-white mb-2">{cat.name}</h2>
                                    <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {cat.description || 'Explore our exclusive range of premium products in this category.'}
                                    </p>
                                    <span className="inline-flex items-center text-blue-400 font-bold text-sm tracking-widest uppercase">
                                        Explore <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <p className="text-xl text-gray-400 font-medium">No categories available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;
