import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function UnsubscribePage() {
    const { email } = useParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = async () => {
            try {
                await axios.get(`http://localhost:3000/api/campaigns/unsubscribe/${encodeURIComponent(email || '')}`);
                setStatus('success');
                setMessage('You have been successfully unsubscribed from our newsletter.');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Failed to unsubscribe. Please try again.');
            }
        };

        if (email) {
            unsubscribe();
        } else {
            setStatus('error');
            setMessage('Invalid unsubscribe link.');
        }
    }, [email]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 mx-auto text-gray-400 animate-spin mb-6" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing...</h1>
                        <p className="text-gray-600">Please wait while we unsubscribe you.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribed</h1>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <Link
                            to="/"
                            className="inline-block px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Return to Homepage
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 mx-auto text-red-500 mb-6" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <Link
                            to="/"
                            className="inline-block px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Return to Homepage
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
