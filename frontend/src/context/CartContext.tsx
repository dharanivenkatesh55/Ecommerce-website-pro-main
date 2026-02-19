import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    brand: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    cartCount: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    // Watch for token changes in localStorage (simple way to sync across tabs/login)
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
        };
        window.addEventListener('storage', handleStorageChange);

        // Polling as a fallback for same-tab login
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Load cart
    useEffect(() => {
        if (token) {
            api.get('/cart')
                .then(res => setCart(res.data))
                .catch(err => {
                    console.error('Failed to fetch cart', err);
                    if (err.response?.status === 401) {
                        setToken(null);
                        localStorage.removeItem('token');
                    }
                });
        } else {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) setCart(JSON.parse(savedCart));
            else setCart([]);
        }
    }, [token]);

    // Save to localStorage ONLY if guest
    useEffect(() => {
        if (!token) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, token]);

    const addToCart = async (product: any) => {
        const currentToken = localStorage.getItem('token');
        const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.main_image || '',
            brand: product.brand || '',
            quantity: 1
        };

        if (currentToken) {
            try {
                await api.post('/cart/add', { productId: product.id, quantity: 1 });
                const res = await api.get('/cart');
                setCart(res.data);
            } catch (err) {
                console.error('Add to cart failed', err);
                // If it failed because of auth, fallback to local
                setCart((prevCart: CartItem[]) => {
                    const existingItem = prevCart.find(item => item.id === product.id);
                    if (existingItem) {
                        return prevCart.map(item =>
                            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        );
                    }
                    return [...prevCart, newItem];
                });
            }
        } else {
            setCart((prevCart: CartItem[]) => {
                const existingItem = prevCart.find(item => item.id === product.id);
                if (existingItem) {
                    return prevCart.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prevCart, newItem];
            });
        }
    };

    const removeFromCart = async (productId: number) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                await api.delete(`/cart/${productId}`);
                setCart((prev: CartItem[]) => prev.filter(item => item.id !== productId));
            } catch (err) {
                console.error('Remove from cart failed', err);
            }
        } else {
            setCart((prevCart: CartItem[]) => prevCart.filter(item => item.id !== productId));
        }
    };

    const clearCart = async () => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                await api.delete('/cart');
                setCart([]);
            } catch (err) {
                console.error('Clear cart failed', err);
            }
        } else {
            setCart([]);
        }
    };

    // Clear cart state when token is removed (logout)
    useEffect(() => {
        if (!token) {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) setCart(JSON.parse(savedCart));
            else setCart([]);
        }
    }, [token]);

    const cartCount = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
