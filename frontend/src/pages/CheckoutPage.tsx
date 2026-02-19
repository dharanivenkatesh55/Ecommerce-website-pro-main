import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const CheckoutPage: React.FC = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        cardNumber: '',
        expDate: '',
        cvv: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/orders', {
                ...formData,
                totalPrice,
                items: cart
            });
            setStep(3);
            setTimeout(() => {
                clearCart();
                navigate('/');
            }, 6000);
        } catch (err) {
            console.error(err);
            alert('Failed to process order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            {/* Progress Bar */}
            <div className="flex justify-center mb-16">
                <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'}`}>1</div>
                    <div className={`h-1 w-16 rounded-full transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'}`}>2</div>
                    <div className={`h-1 w-16 rounded-full transition-all ${step >= 3 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'}`}>3</div>
                </div>
            </div>

            {step === 1 && (
                <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-10 border-b border-gray-50 bg-gray-50/50">
                        <h1 className="text-2xl md:text-3xl font-black">Shipping Details</h1>
                        <p className="text-gray-500 mt-2 text-sm md:text-base">Where should we send your premium pieces?</p>
                    </div>
                    <form onSubmit={nextStep} className="p-6 md:p-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="Ram" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="name@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                            <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="414 Junctionroad" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="Salem" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code</label>
                                <input required name="zip" value={formData.zip} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="636305" />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-full font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                            Continue to Payment
                        </button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-10 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black">Secure Payment</h1>
                            <p className="text-gray-500 mt-2 text-sm md:text-base">All transactions are encrypted and secure.</p>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total cost</p>
                            <p className="text-2xl md:text-3xl font-black text-blue-600">₹{totalPrice}</p>
                        </div>
                    </div>
                    <form onSubmit={handleComplete} className="p-6 md:p-10 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <PaymentOption
                                id="gpay"
                                name="Google Pay"
                                icon="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                                selected={formData.cardNumber === 'gpay'}
                                onClick={() => setFormData({ ...formData, cardNumber: 'gpay' })}
                            />
                            <PaymentOption
                                id="phonepe"
                                name="PhonePe"
                                icon="https://www.vectorlogo.zone/logos/phonepe/phonepe-icon.svg"
                                selected={formData.cardNumber === 'phonepe'}
                                onClick={() => setFormData({ ...formData, cardNumber: 'phonepe' })}
                            />
                            <PaymentOption
                                id="card"
                                name="Debit/Credit Card"
                                icon="💳"
                                selected={formData.cardNumber === 'card'}
                                onClick={() => setFormData({ ...formData, cardNumber: 'card' })}
                            />
                            <PaymentOption
                                id="cod"
                                name="Cash on Delivery"
                                icon="🚚"
                                selected={formData.cardNumber === 'cod'}
                                onClick={() => setFormData({ ...formData, cardNumber: 'cod' })}
                            />
                        </div>

                        {formData.cardNumber === 'card' && (
                            <div className="mt-8 p-6 bg-gray-50 rounded-[30px] border border-gray-100 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                                    <input required className="w-full px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <input required className="w-full px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="MM/YY" />
                                    <input required className="w-full px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="CVV" />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-6">
                            <button type="button" onClick={() => setStep(1)} className="flex-grow py-5 border-2 border-gray-900 text-gray-900 rounded-full font-black text-lg hover:bg-gray-900 hover:text-white transition-all">
                                Back
                            </button>
                            <button type="submit" disabled={!formData.cardNumber || loading} className="flex-[2] py-5 bg-blue-600 text-white rounded-full font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:bg-gray-400">
                                {loading ? 'Processing...' : (formData.cardNumber === 'cod' ? 'Place Order' : 'Pay Now')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {step === 3 && (
                <div className="text-center py-12 md:py-20 animate-fade-in">
                    <div className="mb-8 md:mb-10 inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-green-100 text-green-600 rounded-full text-4xl md:text-5xl animate-bounce shadow-2xl shadow-green-100">
                        ✓
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-6">Payment Successful</h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-md mx-auto mb-10 md:mb-12 px-6">Thank you, <span className="text-blue-600 font-bold">{formData.name}</span>! Your order has been placed and will be delivered to <span className="text-gray-900 font-semibold">{formData.city}</span> soon.</p>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-6 rounded-3xl inline-block text-left border border-gray-100">
                            <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-2">Order Summary</p>
                            <p className="text-gray-900 font-medium">{cart.length} items purchased for a total of <span className="font-black text-blue-600">₹{totalPrice}</span></p>
                        </div>
                        <p className="text-gray-400 text-sm mt-8">Redirecting you to the home page in a few seconds...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const PaymentOption = ({ id, name, icon, selected, onClick }: { id: string, name: string, icon: string, selected: boolean, onClick: () => void }) => (
    <button
        id={id}
        type="button"
        onClick={onClick}
        className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-300 ${selected ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100' : 'border-gray-100 bg-white hover:border-gray-200'}`}
    >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${selected ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
            {icon.startsWith('http') ? <img src={icon} alt={name} className="w-8 h-8 object-contain" /> : icon}
        </div>
        <div className="text-left">
            <p className={`font-black text-sm md:text-base ${selected ? 'text-gray-900' : 'text-gray-500'}`}>{name}</p>
            {selected && <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">Selected</p>}
        </div>
    </button>
);

export default CheckoutPage;
