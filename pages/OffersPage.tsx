import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, CreditCard, Tag, Copy, Check, Zap, ShoppingBag, ArrowRight } from 'lucide-react';
import { MagicCard, MagicGrid } from '../components/MagicUI';

const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const offers = [
    {
      id: 'bank-1',
      type: 'bank',
      title: 'Prepaid Perk',
      description: 'Get a Mystery Gift on all orders paid via Credit Card or UPI.',
      code: 'AUTO-APPLIED',
      color: 'bg-gradient-to-r from-purple-900 to-indigo-900',
      icon: <Gift className="w-8 h-8 text-white" />,
      textColor: 'text-white',
      backgroundImage: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&auto=format&fit=crop&q=60' // Gift wrap bg
    },
    {
      id: 'welcome-1',
      type: 'coupon',
      title: 'Welcome Bonus',
      description: 'Flat 15% off on your first order above $50.',
      code: 'WELCOME15',
      color: 'bg-white border-2 border-dashed border-indigo-200',
      icon: <Tag className="w-8 h-8 text-indigo-500" />,
      textColor: 'text-gray-900',
      backgroundImage: null
    },
    {
      id: 'seasonal-1',
      type: 'sale',
      title: 'Electronics Flash Sale',
      description: 'Up to 40% off on headphones and smartwatches.',
      code: 'TECH40',
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      icon: <Zap className="w-8 h-8 text-white" />,
      textColor: 'text-white',
      backgroundImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=60' // Tech bg
    }
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-md">Exclusive Offers & Rewards</h1>
        <p className="text-indigo-100 max-w-2xl mx-auto">
          Maximize your savings with our hand-picked deals, bank offers, and limited-time coupons.
        </p>
      </div>

      <MagicGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Main Bank Offer Card - Featured */}
        <MagicCard className="md:col-span-2 rounded-3xl !p-0 text-white shadow-xl relative !overflow-hidden group min-h-[300px] flex items-center border-none">
             {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-slate-900">
                 <img 
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=60" 
                    alt="Shopping" 
                    className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/80"></div>
            </div>
            
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 w-full p-8">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/10">
                        <CreditCard size={14} /> 
                        <span>PARTNER OFFER</span>
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                      Free Mystery Gift 🎁
                    </h2>
                    <p className="text-slate-200 mb-8 text-lg max-w-lg">
                        Unlock a guaranteed freebie when you pay using any Prepaid Method (Card, Net Banking, Wallet). No code required.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-white text-indigo-900 font-bold py-3.5 px-8 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg relative z-20"
                    >
                        Shop Now <ArrowRight size={18} />
                    </button>
                </div>
                <div className="hidden md:flex justify-center">
                    <div className="relative animate-float">
                        <Gift className="w-40 h-40 text-purple-300 drop-shadow-2xl" />
                    </div>
                </div>
            </div>
        </MagicCard>

        {/* Other Offers Grid */}
        {offers.slice(1).map((offer) => (
            <MagicCard key={offer.id} className={`rounded-2xl !p-6 shadow-sm flex flex-col justify-between relative !overflow-hidden transition-all hover:shadow-lg group ${offer.color}`}>
                {/* Optional BG Image */}
                {offer.backgroundImage && (
                    <div className="absolute inset-0">
                        <img src={offer.backgroundImage} alt="" className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
                    </div>
                )}
                
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner`}>
                            {offer.icon}
                        </div>
                    </div>
                    <div className="mb-6">
                        <h3 className={`text-xl font-bold mb-1 ${offer.textColor}`}>{offer.title}</h3>
                        <p className={`text-sm opacity-90 ${offer.textColor}`}>{offer.description}</p>
                    </div>
                </div>
                
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-1 flex justify-between items-center border border-white/20">
                    <div className={`font-mono font-bold px-4 ${offer.textColor}`}>
                        {offer.code}
                    </div>
                    <button 
                        onClick={() => copyToClipboard(offer.code)}
                        className="bg-white/90 text-gray-900 p-2 rounded-lg hover:bg-white transition-colors relative z-20"
                        title="Copy Code"
                    >
                        {copiedCode === offer.code ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                </div>
            </MagicCard>
        ))}

        {/* Review Reward Card */}
        <MagicCard className="rounded-2xl !p-6 shadow-sm bg-indigo-50 border border-indigo-100 flex flex-col justify-between relative !overflow-hidden">
             <div className="absolute top-0 right-0 -mt-10 -mr-10">
                <ShoppingBag className="w-40 h-40 text-indigo-100 opacity-50 rotate-12" />
             </div>
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white text-indigo-600 shadow-sm">
                        <ShoppingBag size={32} />
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Reviewer Rewards</h3>
                    <p className="text-sm text-gray-600">Earn 100 Points by reviewing products to unlock a special $20 discount code.</p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/')}
                className="relative z-20 w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
                Browse Products
            </button>
        </MagicCard>
      </MagicGrid>
    </div>
  );
};

export default OffersPage;