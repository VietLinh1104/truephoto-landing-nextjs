'use client';
import { useState } from 'react';
import { create } from '@/lib/strapiClient';

interface SuccessPopupProps {
    isVisible: boolean;
    onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 relative border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close popup"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                    <p className="text-gray-600">
                        Thank you for your email. We will contact you as soon as possible!
                    </p>
                </div>
            </div>
        </div>
    );
};

const EmailSubscription: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = {
                email: email
            };
        
        
            const response = await create('client-email-submissions', submitData);
            console.log('Response from Strapi:', response);
            setStatus('success');
            setEmail('');
            setShowPopup(true);
        } catch (error) {
            console.error('Error submitting email:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="email-subscription" className="w-full py-5 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="mb-4 text-primary">
                        Leave Your Email for Immediate Contact
                    </h2>
                    <p className="text-gray-600 mb-8">
                        We will contact you as soon as possible to provide detailed service consultation
                    </p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="flex-1 max-w-md px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        > 
                            {loading ? 'Sending...' : 'Send Now'}
                        </button>
                    </form>
                    
                    {status === 'error' && (
                        <p className="mt-4 text-red-600">
                            An error occurred. Please try again later!
                        </p>
                    )}
                </div>
            </div>

            <SuccessPopup 
                isVisible={showPopup} 
                onClose={() => setShowPopup(false)} 
            />
        </section>
    );
};

export default EmailSubscription; 