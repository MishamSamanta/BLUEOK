import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { Clock, MapPin, ArrowRight, Tag, AlertTriangle, Radar, Wifi } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { MagicCard, MagicGrid } from '../components/MagicUI';

const NearbyDealsPage: React.FC = () => {
  const { deals, clearNotifications, removeDeal, addDeal } = useMarket();
  const navigate = useNavigate();
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const simulateIncomingCancellation = () => {
    setIsSimulating(true);
    // Pick a random product to simulate a cancellation
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    
    // Slight delay to feel like a network request
    setTimeout(() => {
        addDeal(randomProduct);
        setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-white/10 pb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600/20 p-2 rounded-full border border-indigo-500/30">
                <Radar className="text-indigo-300 animate-spin-slow" size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Hyperlocal Deal Radar
            </h1>
          </div>
          <p className="text-indigo-100 max-w-2xl">
            <strong>System Active:</strong> Monitoring cancellations within a <strong>10 km radius</strong>. 
            When a neighbor cancels an order before shipment, you get exclusive access to the discounted item to save on shipping & returns.
          </p>
        </div>

        {/* Simulation Control for Demo Purposes */}
        <button 
            onClick={simulateIncomingCancellation}
            disabled={isSimulating}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all backdrop-blur-sm"
        >
            <Wifi size={16} className={isSimulating ? "animate-ping" : ""} />
            {isSimulating ? "Scanning Network..." : "Simulate Neighbor Cancel"}
        </button>
      </div>

      {deals.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl">
          <div className="bg-gray-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6 relative">
            <MapPin className="h-10 w-10 text-gray-400" />
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping opacity-20"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scanning for Nearby Cancellations...</h2>
          <p className="text-gray-500 mb-8 px-8">
            No active cancellations in your 10 km radius right now. 
            <br/>The system will automatically notify you when a nearby order is released.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-8">
            <button 
              onClick={simulateIncomingCancellation}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
              Demo: Trigger Cancellation
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 text-indigo-600 font-bold border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all"
            >
              Browse Regular Listings
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
             <div className="bg-amber-100/90 border border-amber-200 rounded-lg px-4 py-2 flex items-center text-amber-900 text-sm font-medium shadow-sm w-fit">
                <AlertTriangle size={16} className="mr-2" />
                These deals are time-sensitive. They disappear when returned to the warehouse.
             </div>

            <MagicGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal) => {
                const productInfo = PRODUCTS.find(p => p.id === deal.productId);
                const imageUrl = productInfo?.imageUrl || '';

                return (
                    <MagicCard 
                    key={deal.id} 
                    className="bg-white rounded-2xl border border-indigo-100 shadow-lg flex flex-col relative !overflow-hidden p-0 group"
                    >
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
                        15% OFF
                    </div>
                    
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img src={imageUrl} alt={deal.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center text-white font-medium text-sm">
                            <Clock size={14} className="mr-1.5 text-yellow-400" />
                            <span>Expires in: <span className="font-mono font-bold text-yellow-400">{formatTime(deal.timeLeft)}</span></span>
                        </div>
                        </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 line-clamp-2">{deal.productName}</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                <MapPin size={12} className="mr-1 text-indigo-500" />
                                {deal.distance} away
                            </div>
                            <div className="flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 font-medium">
                                <Tag size={12} className="mr-1" />
                                Immediate Pickup
                            </div>
                        </div>

                        <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-gray-400 line-through text-sm">${deal.originalPrice.toFixed(2)}</div>
                            <div className="text-2xl font-bold text-indigo-600">${deal.discountedPrice.toFixed(2)}</div>
                        </div>
                        
                        <button 
                            onClick={() => {
                                removeDeal(deal.id);
                                navigate('/payment');
                            }}
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-lg shadow-indigo-200 relative z-20 group-hover:shadow-indigo-300"
                        >
                            Claim This Deal <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        </div>
                    </div>
                    </MagicCard>
                );
                })}
            </MagicGrid>
        </div>
      )}
    </div>
  );
};

export default NearbyDealsPage;