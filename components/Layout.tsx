import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Bell, MapPin, Percent, User, X, Clock } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import DarkVeil from './DarkVeil';
import AIChatBot from './AIChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { notificationCount, deals, latestDeal, dismissToast } = useMarket();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 relative">
      {/* Background Effect */}
      <DarkVeil />

      {/* AI Chat Bot - Added globally */}
      <AIChatBot />

      {/* Simulated System Push Notification Toast */}
      {latestDeal && (
        <div className="fixed top-20 right-4 z-[100] animate-slide-in-right max-w-sm w-full">
          <div className="bg-white/95 backdrop-blur-md border-l-4 border-indigo-600 rounded-lg shadow-2xl p-4 relative overflow-hidden">
            {/* Glossy Effect */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                    Hyperlocal Alert • {latestDeal.distance}
                  </p>
                  <button onClick={dismissToast} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mt-1">
                  Cancellation Opportunity!
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-snug">
                  A neighbor just canceled <span className="font-semibold text-gray-800">{latestDeal.productName}</span>.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    15% OFF
                  </span>
                  <span className="inline-flex items-center text-xs text-amber-600 font-medium">
                    <Clock size={10} className="mr-1" /> Ends in 30m
                  </span>
                </div>
                <button 
                  onClick={() => {
                    dismissToast();
                    navigate('/nearby-deals');
                  }}
                  className="mt-3 w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded shadow hover:bg-indigo-700 transition-colors"
                >
                  View Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <ShoppingBag size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">BlueOak.in</span>
            </Link>
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${location.pathname === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'}`}
              >
                Home
              </Link>
              
              {/* Offers Feature */}
              <Link 
                to="/offers" 
                className={`flex items-center gap-1 text-sm font-medium transition-colors px-3 py-2 rounded-md ${location.pathname === '/offers' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'}`}
              >
                <Percent size={16} />
                <span>Offers</span>
              </Link>
              
              {/* Nearby Deals Feature */}
              <Link 
                to="/nearby-deals"
                className={`relative group flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all
                  ${location.pathname === '/nearby-deals' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
              >
                <MapPin size={16} className={deals.length > 0 ? "text-indigo-600 animate-pulse" : ""} />
                <span className="hidden sm:inline">Nearby Deals</span>
                <span className="sm:hidden">Nearby</span>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">
                      {notificationCount}
                    </span>
                  </span>
                )}
              </Link>

              <div className="relative flex items-center border-l border-gray-200 pl-4 ml-2 gap-2">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell size={20} />
                  {deals.length > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </button>
                
                {/* Profile Link */}
                <Link 
                  to="/profile"
                  className={`p-2 rounded-full transition-colors ${location.pathname === '/profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                  title="My Account"
                >
                  <User size={20} />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
      <footer className="bg-white/90 border-t border-gray-200 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} BlueOak.in. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;