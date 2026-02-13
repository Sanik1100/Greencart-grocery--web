import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {axios} = useAppContext();
    const orderId = searchParams.get('orderId');
    const [countdown, setCountdown] = useState(5);

    // Auto redirect to my-orders after 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/my-orders');
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">

                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 mb-4">Your payment via eSewa was completed successfully.</p>

                {orderId && (
                    <p className="text-sm text-gray-400 mb-6">
                        Order ID: <span className="font-medium text-gray-600">{orderId}</span>
                    </p>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-700 text-sm">
                        Redirecting to your orders in <span className="font-bold">{countdown}</span> seconds...
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition font-medium"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;