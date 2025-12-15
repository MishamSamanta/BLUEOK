import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NearbyDeal, Product } from '../types';

interface MarketContextType {
  deals: NearbyDeal[];
  addDeal: (product: Product) => void;
  removeDeal: (dealId: string) => void;
  notificationCount: number;
  clearNotifications: () => void;
  latestDeal: NearbyDeal | null; // For toast notification
  dismissToast: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<NearbyDeal[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [latestDeal, setLatestDeal] = useState<NearbyDeal | null>(null);

  // Timer to decrease time left on deals
  useEffect(() => {
    const timer = setInterval(() => {
      setDeals(prevDeals => 
        prevDeals.map(deal => ({ ...deal, timeLeft: Math.max(0, deal.timeLeft - 1) }))
                 .filter(deal => deal.timeLeft > 0)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addDeal = (product: Product) => {
    const newDeal: NearbyDeal = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productName: product.name,
      originalPrice: product.price,
      discountedPrice: Number((product.price * 0.85).toFixed(2)), // 15% discount default
      distance: (Math.random() * 8 + 0.5).toFixed(1) + ' km', // Within 10km radius
      timeLeft: 1800, // 30 minutes
      timestamp: Date.now(),
    };
    
    setDeals(prev => [newDeal, ...prev]);
    setNotificationCount(prev => prev + 1);
    
    // Trigger "Push Notification" simulation
    setLatestDeal(newDeal);
    
    // Auto-dismiss toast after 8 seconds
    setTimeout(() => {
      setLatestDeal(current => current?.id === newDeal.id ? null : current);
    }, 8000);
  };

  const removeDeal = (dealId: string) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
  };

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  const dismissToast = () => {
    setLatestDeal(null);
  };

  return (
    <MarketContext.Provider value={{ deals, addDeal, removeDeal, notificationCount, clearNotifications, latestDeal, dismissToast }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};