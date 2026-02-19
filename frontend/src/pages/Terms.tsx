import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="container mx-auto p-10 max-w-4xl text-gray-700">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Terms & Conditions</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">1. Introduction</h2>
                    <p>Welcome to E-Commerce Pro. By accessing this website, you agree to be bound by these terms and conditions.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">2. Intellectual Property Rights</h2>
                    <p>Other than the content you own, under these Terms, E-Commerce Pro and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">3. Restrictions</h2>
                    <p>You are specifically restricted from all of the following: publishing any Website material in any other media; selling, sublicensing and/or otherwise commercializing any Website material.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">4. Your Privacy</h2>
                    <p>Please read our Privacy Policy. Your privacy is important to us.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">5. Governing Law & Jurisdiction</h2>
                    <p>These Terms will be governed by and interpreted in accordance with the laws of the State of New York.</p>
                </section>
                <p className="text-sm text-gray-400 pt-10">Last updated: February 2026</p>
            </div>
        </div>
    );
};

export default Terms;
