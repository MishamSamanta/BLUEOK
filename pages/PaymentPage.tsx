import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentMethod } from '../types';
import { CreditCard, Smartphone, Banknote, Building, Lock, ArrowLeft, CheckCircle2, Gift, Sparkles } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Helper to determine if a method is prepaid
  const isPrepaid = (method: PaymentMethod) => method !== PaymentMethod.COD;

  const handlePayment = () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 1500);
  };

  if (isComplete) {
    const earnedFreebie = selectedMethod && isPrepaid(selectedMethod);

    return (
      <div className="max-w-md mx-auto mt-12 text-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100 animate-fade-in">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully using {selectedMethod}.
        </p>

        {earnedFreebie && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 mb-8 animate-bounce-in">
            <div className="flex items-center justify-center text-purple-600 font-bold mb-1">
              <Gift className="w-5 h-5 mr-2" />
              Bonus Unlocked!
            </div>
            <p className="text-sm text-gray-600">
              A <span className="font-bold text-purple-600">Mystery Freebie</span> has been added to your package for paying online.
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const renderIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD: return <CreditCard className="w-6 h-6" />;
      case PaymentMethod.GOOGLE_PAY: return <Smartphone className="w-6 h-6" />;
      case PaymentMethod.COD: return <Banknote className="w-6 h-6" />;
      case PaymentMethod.NET_BANKING: return <Building className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Product
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            <Lock size={12} className="mr-1.5" />
            Secure Payment
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Select Payment Method</h2>
          
          <div className="space-y-4 mb-8">
            {Object.values(PaymentMethod).map((method) => {
              const prepaid = isPrepaid(method);
              return (
                <label 
                  key={method}
                  className={`
                    relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${selectedMethod === method 
                      ? 'border-indigo-600 bg-indigo-50/50' 
                      : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'}
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={selectedMethod === method}
                    onChange={() => setSelectedMethod(method)}
                  />
                  <div className={`p-2 rounded-lg mr-4 ${selectedMethod === method ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {renderIcon(method)}
                  </div>
                  
                  <div className="flex-1">
                    <span className={`font-medium block ${selectedMethod === method ? 'text-indigo-900' : 'text-gray-700'}`}>
                      {method}
                    </span>
                    {/* Freebie Tag for Prepaid Methods */}
                    {prepaid && (
                      <span className="inline-flex items-center text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full mt-1 border border-pink-100">
                        <Gift size={10} className="mr-1" />
                        Freebie Eligible
                      </span>
                    )}
                  </div>

                  {selectedMethod === method && (
                    <div className="absolute right-4 text-indigo-600">
                      <div className="h-5 w-5 rounded-full border-[5px] border-indigo-600" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          {/* Dynamic Freebie Notification Section */}
          <div className="mb-8 min-h-[80px]">
            {selectedMethod && isPrepaid(selectedMethod) ? (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg animate-fade-in flex items-center">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <p className="font-bold text-lg">Free Mystery Gift Unlocked! 🎉</p>
                  <p className="text-indigo-100 text-sm opacity-90">Included with your prepaid order.</p>
                </div>
              </div>
            ) : selectedMethod && !isPrepaid(selectedMethod) ? (
               <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-600 flex items-center justify-between">
                <div className="flex items-center">
                   <Banknote className="w-5 h-5 mr-3 text-gray-400" />
                   <p className="text-sm">Paying with Cash? You're missing out!</p>
                </div>
                <button 
                  onClick={() => setSelectedMethod(null)} 
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Switch for Gift
                </button>
               </div>
            ) : (
               <div className="h-full border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                 Select a prepaid method to unlock a reward
               </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">Calculated at next step</span>
            </div>
            <button
              disabled={!selectedMethod || isProcessing}
              onClick={handlePayment}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center
                ${!selectedMethod || isProcessing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:scale-[0.98]'}
              `}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay with ${selectedMethod || '...'}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;