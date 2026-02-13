import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailed = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message') || 'Your payment could not be completed.';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">

                {/* Failed Icon */}
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
                <p className="text-gray-500 mb-6">{message}</p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 text-sm">
                        No amount has been deducted. Your cart items are safe.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition font-medium"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;