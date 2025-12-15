import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Award, ArrowRight, Clock, CheckCircle2, XCircle, AlertTriangle, RefreshCw, MapPin, Search, User, Zap, ChevronRight } from 'lucide-react';
import { MagicCard, MagicGrid } from '../components/MagicUI';

// Mock types for the feature
interface PotentialBuyer {
  id: string;
  name: string;
  distance: string;
  rating: number;
  avatar: string;
  offerTime: string; // e.g. "Can pick up in 2 hrs"
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // --- State for Cancellation Flow ---
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [foundBuyers, setFoundBuyers] = useState<PotentialBuyer[]>([]);
  const [transferComplete, setTransferComplete] = useState(false);

  // Simulated User Data
  const userData = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    loyaltyPoints: 1250,
    codStats: {
      totalPlaced: 10,
      totalCancelled: 2,
      penaltyThreshold: 3
    },
    orders: [
      { id: '#ORD-5543', date: 'Jan 05, 2024', total: 34.99, status: 'Shipped', items: 'Minimalist Ceramic Vase', image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=100&auto=format&fit=crop&q=60' },
      { id: '#ORD-1102', date: 'Dec 10, 2023', total: 89.99, status: 'Canceled by Customer', items: '360° Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&auto=format&fit=crop&q=60' },
      { id: '#ORD-3321', date: 'Nov 15, 2023', total: 249.99, status: 'Delivered', items: 'Wireless Noise-Canceling Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=60' },
      { id: '#ORD-9921', date: 'Nov 02, 2023', total: 45.50, status: 'Canceled by Customer', items: 'Aroma Diffuser', image: 'https://images.unsplash.com/photo-1608508644127-5364d0089a45?w=100&auto=format&fit=crop&q=60' },
      { id: '#ORD-7782', date: 'Oct 24, 2023', total: 129.99, status: 'Delivered', items: 'Urban Running Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=60' },
    ]
  };

  const cancellationRate = ((userData.codStats.totalCancelled / userData.codStats.totalPlaced) * 100).toFixed(1);
  const remainingStrikes = userData.codStats.penaltyThreshold - userData.codStats.totalCancelled;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Canceled by Customer': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Delivered': return <CheckCircle2 size={14} className="mr-1" />;
      case 'Shipped': return <Clock size={14} className="mr-1" />;
      case 'Canceled by Customer': return <XCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  // --- Handlers ---

  const handleReturnClick = (orderId: string) => {
    setActiveOrderId(orderId);
    setShowBuyerModal(true);
    setScanning(true);
    setFoundBuyers([]);
    setTransferComplete(false);

    // Simulate scanning delay
    setTimeout(() => {
      setScanning(false);
      setFoundBuyers([
        {
          id: 'b1',
          name: "Sarah Jenkins",
          distance: "0.4 km away",
          rating: 4.9,
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
          offerTime: "Can pick up in 45 mins"
        },
        {
          id: 'b2',
          name: "Mike Chen",
          distance: "1.2 km away",
          rating: 4.7,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
          offerTime: "Wants it by tomorrow"
        },
        {
          id: 'b3',
          name: "Local Cafe Hub",
          distance: "0.8 km away",
          rating: 5.0,
          avatar: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&auto=format&fit=crop&q=60",
          offerTime: "Open for drop-off until 8PM"
        }
      ]);
    }, 2500);
  };

  const handleTransfer = () => {
    setTransferComplete(true);
    // In a real app, update DB here
    setTimeout(() => {
        setShowBuyerModal(false);
        setActiveOrderId(null);
    }, 3000);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8 relative">
      
      {/* --- Buyer Discovery Modal --- */}
      {showBuyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-scale-in">
            
            {!transferComplete ? (
              <>
                <div className="bg-indigo-600 p-6 text-white text-center">
                  <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin-slow" /> Sustainable Re-Homing
                  </h3>
                  <p className="text-indigo-100 text-sm mt-2">
                    Don't return to the warehouse! We found neighbors who want this item right now.
                  </p>
                </div>

                <div className="p-6">
                  {scanning ? (
                    <div className="py-12 text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping"></div>
                        <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center border-4 border-indigo-50">
                          <Search className="w-10 h-10 text-indigo-600" />
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Scanning Neighborhood...</h4>
                      <p className="text-gray-500 text-sm">Looking for buyers within 2km</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-500 uppercase">3 Buyers Found</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">High Demand</span>
                      </div>
                      
                      {foundBuyers.map((buyer) => (
                        <div key={buyer.id} className="group border border-gray-100 rounded-xl p-3 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer flex items-center gap-4">
                          <img src={buyer.avatar} alt={buyer.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900 group-hover:text-indigo-700">{buyer.name}</h5>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <MapPin size={10} className="mr-1" /> {buyer.distance}
                              <span className="mx-1">•</span>
                              <User size={10} className="mr-1" /> {buyer.rating}★
                            </div>
                            <div className="mt-1 text-xs font-medium text-green-600 flex items-center">
                               <Zap size={10} className="mr-1" /> {buyer.offerTime}
                            </div>
                          </div>
                          <button 
                            onClick={handleTransfer}
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                          >
                            Transfer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                     <button 
                      onClick={() => setShowBuyerModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                     >
                       No thanks, process standard return
                     </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center bg-white">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                   <CheckCircle2 className="w-10 h-10 text-green-600" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Transfer Initiated!</h3>
                 <p className="text-gray-600 mb-6">
                   You've successfully connected with a neighbor. We've sent them the pickup details.
                 </p>
                 <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-2">
                   <p className="font-bold text-indigo-900">+50 Loyalty Points Earned</p>
                   <p className="text-xs text-indigo-700">Green Choice Bonus</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Account & Loyalty Status</h1>
          <p className="text-indigo-100 mt-1">Manage your orders and view your account health.</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 transition-transform hover:scale-105 border border-indigo-400/30">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Award size={28} />
          </div>
          <div>
            <p className="text-xs font-medium opacity-90 uppercase tracking-wider">Loyalty Balance</p>
            <p className="text-2xl font-bold">{userData.loyaltyPoints.toLocaleString()} PTS</p>
          </div>
        </div>
      </div>

      <MagicGrid className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Warnings */}
        <div className="space-y-8">
           {/* COD Reliability Score Card */}
           <MagicCard className="bg-white rounded-2xl shadow-sm border border-gray-200 !overflow-hidden !p-0">
             <div className="bg-gray-900 text-white p-6">
               <h3 className="font-bold text-lg flex items-center">
                 <ShieldAlert className="mr-2 text-yellow-400" />
                 COD Reliability Score
               </h3>
               <p className="text-gray-400 text-sm mt-1">Metrics based on your order behavior</p>
             </div>
             <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{userData.codStats.totalPlaced}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total COD</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{userData.codStats.totalCancelled}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Cancelled</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{cancellationRate}%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Rate</p>
                  </div>
                </div>

                {/* Warning Section */}
                <div className={`rounded-xl p-5 border-l-4 shadow-sm ${remainingStrikes <= 1 ? 'bg-red-50 border-red-600' : 'bg-yellow-50 border-yellow-500'}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <AlertTriangle className={`w-6 h-6 ${remainingStrikes <= 1 ? 'text-red-600' : 'text-yellow-600'}`} />
                    </div>
                    <div className="ml-3">
                      <p className={`font-bold text-sm uppercase tracking-wide ${remainingStrikes <= 1 ? 'text-red-800' : 'text-yellow-800'}`}>
                        Current Status: {remainingStrikes <= 1 ? 'HIGH RISK' : 'MODERATE'}
                      </p>
                      <p className={`text-sm mt-2 leading-relaxed ${remainingStrikes <= 1 ? 'text-red-700' : 'text-yellow-700'}`}>
                        You have <strong>{userData.codStats.totalCancelled} canceled</strong> COD orders. 
                        <span className="block mt-2 font-semibold">
                          One more cancellation will restrict your account to <span className="underline">Prepaid Payments Only</span> for 90 days.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-400 text-center italic">
                  *Simulated data for prototype demonstration
                </div>
             </div>
           </MagicCard>

           {/* Loyalty Redemption Info */}
           <MagicCard className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-100 !p-6">
             <h3 className="font-bold text-indigo-900 mb-2 text-lg">Redeem Your Points</h3>
             <p className="text-sm text-gray-600 mb-5">You have enough points to unlock exclusive rewards.</p>
             <div className="space-y-3">
               <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-indigo-100 shadow-sm relative z-20">
                 <span className="text-gray-700 font-medium">10% Off Coupon</span>
                 <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">1,000 PTS</span>
               </div>
               <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-indigo-100 shadow-sm opacity-60 relative z-20">
                 <span className="text-gray-700 font-medium">VIP Free Shipping</span>
                 <span className="font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">5,000 PTS</span>
               </div>
             </div>
             <button 
                onClick={() => navigate('/offers')}
                className="w-full mt-6 text-indigo-600 font-bold text-sm hover:text-indigo-800 flex items-center justify-center transition-colors border border-indigo-200 rounded-lg py-3 hover:bg-indigo-50 relative z-20"
             >
               View All Rewards <ArrowRight size={16} className="ml-2" />
             </button>
           </MagicCard>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2">
          <MagicCard className="bg-white rounded-2xl shadow-sm border border-gray-200 !overflow-hidden h-full !p-0">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Recent Order History</h3>
              <div className="text-sm text-gray-500">Showing last 5 orders</div>
            </div>
            <div className="overflow-x-auto relative z-20">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userData.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={order.image} alt="Product" className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm" />
                          <div>
                            <div className="font-bold text-gray-900 max-w-[150px] truncate" title={order.items}>{order.items}</div>
                            <div className="text-xs text-gray-500 font-mono">{order.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.date}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'Shipped' && (
                          <button 
                            onClick={() => handleReturnClick(order.id)}
                            className="text-indigo-600 hover:text-indigo-800 text-xs font-bold border border-indigo-200 hover:border-indigo-600 bg-indigo-50 hover:bg-white px-3 py-1.5 rounded-lg transition-all flex items-center whitespace-nowrap"
                          >
                            Return / Transfer <ChevronRight size={12} className="ml-1" />
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <button className="text-gray-400 cursor-not-allowed text-xs font-medium">
                            Return Window Closed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {userData.orders.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p>No orders found.</p>
              </div>
            )}
          </MagicCard>
        </div>

      </MagicGrid>
    </div>
  );
};

export default ProfilePage;