import React from 'react';

const AboutUs: React.FC = () => {
    return (
        <div className="container mx-auto p-10 max-w-4xl">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">About Our Store</h1>
            <div className="bg-white p-10 rounded-3xl shadow-xl space-y-6 text-gray-700 leading-relaxed">
                <p className="text-xl italic text-gray-500 mb-10 text-center">"Bringing quality and style to your doorstep since 2026."</p>
                <p>
                    Welcome to <strong>E-Commerce Pro</strong>, your number one source for all things fashion and electronics.
                    We're dedicated to giving you the very best of products, with a focus on quality,
                    customer service, and uniqueness.
                </p>
                <p>
                    Founded in 2026 by a team of passionate developers, E-Commerce Pro has come a long way from its
                    beginnings in a small home office. When we first started out, our passion for "quality products
                    at affordable prices" drove us to do intense research and gave us the impetus to turn hard
                    work and inspiration into a booming online store.
                </p>
                <p>
                    We now serve customers all over the world and are thrilled to be a part of the fair trade
                    wing of the fashion and tech industry.
                </p>
                <div className="pt-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p>
                        To provide the most seamless shopping experience while ensuring our customers always
                        stay ahead of the trend with our curated collections.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
