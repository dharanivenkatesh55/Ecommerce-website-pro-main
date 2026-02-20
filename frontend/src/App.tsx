import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import CategoryManagement from './pages/CategoryManagement';
import ProductManagement from './pages/ProductManagement';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import CollectionPage from './pages/CollectionPage';
import CheckoutPage from './pages/CheckoutPage';
import CategoriesPage from './pages/CategoriesPage';
import AdminRegister from './pages/AdminRegister';
import BannerManagement from './pages/BannerManagement';
import OrderManagement from './pages/OrderManagement';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import SearchPage from './pages/SearchPage';
import { CartProvider, useCart } from './context/CartContext';


function App() {
  const isAdmin = localStorage.getItem('role') === 'admin';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <CartProvider>
      <Router>
        <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans text-gray-900 overflow-x-hidden">
          <header className="bg-white/80 md:backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
              <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600 flex items-center shrink-0">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 text-sm italic">E</span>
                ECOMPRO
              </Link>

              {/* Search Bar */}
              <div className="hidden lg:flex flex-grow max-w-md mx-8">
                <SearchForm />
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-500 hover:text-blue-600 font-semibold transition">Home</Link>
                <Link to="/about" className="text-gray-500 hover:text-blue-600 font-semibold transition">About</Link>
                <Link to="/contact" className="text-gray-500 hover:text-blue-600 font-semibold transition">Contact</Link>

                {localStorage.getItem('token') ? (
                  <>
                    {isAdmin && <Link to="/admin" className="text-gray-500 hover:text-blue-600 font-semibold transition">Admin</Link>}
                    <Link to="/profile" className="px-5 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">Profile</Link>
                  </>
                ) : (
                  <Link to="/login" className="px-5 py-2 border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition">Login</Link>
                )}

                <CartButton />
              </nav>

              {/* Mobile Right Icons */}
              <div className="flex items-center space-x-4 md:hidden">
                <CartButton />
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 text-gray-900 focus:outline-none relative z-[60]"
                  aria-label="Open menu"
                >
                  <div className="w-6 h-5 flex flex-col justify-between">
                    <span className="w-full h-0.5 bg-current rounded-full"></span>
                    <span className="w-full h-0.5 bg-current rounded-full"></span>
                    <span className="w-full h-0.5 bg-current rounded-full"></span>
                  </div>
                </button>
              </div>

            </div>
          </header>

          {/* Mobile Menu Overlay - Move outside header for solid opaque background */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-white z-[999] md:hidden overflow-y-auto">
              <div className="relative flex flex-col min-h-screen p-8">
                <div className="flex justify-between items-center mb-16">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black tracking-tighter text-blue-600 flex items-center shrink-0">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 text-sm italic">E</span>
                    ECOMPRO
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 text-2xl"
                  >
                    &times;
                  </button>
                </div>
                <div className="mb-10 lg:hidden">
                  <SearchForm />
                </div>
                <nav className="flex flex-col space-y-8">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black text-gray-900">Home</Link>
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black text-gray-900">About</Link>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black text-gray-900">Contact</Link>
                  <div className="pt-8 border-t border-gray-100 flex flex-col space-y-4">
                    {isAdmin ? (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block w-full py-5 bg-blue-600 text-white rounded-2xl text-center font-black text-xl shadow-xl shadow-blue-100">Dashboard</Link>
                    ) : (
                      <Link to="/admin/login" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-gray-500">Admin Login</Link>
                    )}
                  </div>
                </nav>
                <div className="mt-auto py-8 text-gray-400 text-sm font-medium">
                  © 2026 ECOMPRO Premium Store
                </div>
              </div>
            </div>
          )}

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/collection/:category" element={<CollectionPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* User Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/search" element={<SearchPage />} />

              {/* Admin Routes */}

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/banners" element={<BannerManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-gray-100 py-12">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <h2 className="text-xl font-bold mb-4">ECOMPRO</h2>
                <p className="text-gray-400 max-w-sm mb-4">The world's leading premium e-commerce platform for high-quality fashion and high-end electronics.</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>📍 1/217 Fashion park, chennai, India</p>
                  <p>📞 +91 6369138655</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-500">
                  <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-blue-600">Contact Us</Link></li>
                  <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Social</h3>
                <div className="flex space-x-4">
                  <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-50 transition">FB</span>
                  <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-50 transition">TW</span>
                  <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-50 transition">IG</span>
                </div>
              </div>
            </div>
            <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-50 text-center text-gray-400 text-sm">
              &copy; 2026 E-Commerce Website. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  )
}

function SearchForm() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full group">
      <input
        type="text"
        placeholder="Search for items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-50 border-none rounded-full px-6 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-600 transition">
        🔍
      </button>
    </form>
  );
}

function CartButton() {
  const { cartCount } = useCart();
  return (
    <Link to="/cart" className="relative group">
      <div className="flex items-center space-x-2 text-gray-500 group-hover:text-blue-600 transition font-semibold">
        <span className="text-xl">🛒</span>
        <span>Cart</span>
      </div>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
          {cartCount}
        </span>
      )}
    </Link>
  );
}

function CartPage() {
  const { cart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-12">Your Shopping Bag</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-6">🛍️</div>
          <p className="text-xl text-gray-400 font-medium mb-8">Your bag is empty.</p>
          <Link to="/" className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={`https://ecommerce-website-pro-main.onrender.com${item.image}`} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">{item.brand}</p>
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black mb-2">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 h-fit sticky top-24">
            <h2 className="text-2xl font-black mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-blue-600">₹{totalPrice}</span>
              </div>
            </div>
            <button
              onClick={() => {
                navigate('/checkout');
              }}
              className="w-full py-5 bg-blue-600 text-white rounded-full font-black text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100"
            >
              Checkout Now
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
