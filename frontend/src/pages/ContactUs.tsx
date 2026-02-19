import React from 'react';

const ContactUs: React.FC = () => {
    return (
        <div className="container mx-auto p-10 max-w-5xl">
            <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">Get in Touch</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-indigo-600 text-white p-10 rounded-3xl shadow-xl flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <p className="mb-8 opacity-90 text-lg">We'd love to hear from you. Whether you have a question about products, pricing, or anything else, our team is ready to answer all your questions.</p>
                    <div className="space-y-4">
                        <p className="flex items-center"><span className="mr-4 text-2xl">📧</span> support@ecompro.com</p>
                        <p className="flex items-center"><span className="mr-4 text-2xl">📞</span> +91 6369138655</p>
                        <p className="flex items-center"><span className="mr-4 text-2xl">🏢</span> 1/217 Fashion park, chennai, India</p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                            <input type="text" className="w-full mt-1 px-4 py-2 border rounded-xl" placeholder="Ram" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Email</label>
                            <input type="email" className="w-full mt-1 px-4 py-2 border rounded-xl" placeholder="name@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Message</label>
                            <textarea className="w-full mt-1 px-4 py-2 border rounded-xl" rows={4} placeholder="How can we help?"></textarea>
                        </div>
                        <button type="submit" className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition duration-300">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
