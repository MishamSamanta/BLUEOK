
export type Category = 'Electronics' | 'Fashion' | 'Home';

export interface ProductStats {
  cancellationRate: string;
  returnRate: string; // Rate of returns/exchanges
  avgCancellationTime: string;
  successfulOrders: number;
  satisfactionTrend: number[]; // Array of satisfaction scores (0-100) over last 6 months
}

export interface ProductReviews {
  rating: number;
  count: number;
  pros: string[];
  cons: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
  category: Category;
  stats: ProductStats;
  reviews: ProductReviews;
}

export interface NearbyDeal {
  id: string;
  productId: string;
  productName: string;
  originalPrice: number;
  discountedPrice: number;
  distance: string;
  timeLeft: number; // seconds
  timestamp: number;
}

export enum PaymentMethod {
  CREDIT_CARD = 'Credit/Debit Card',
  GOOGLE_PAY = 'Google Pay / Digital Wallet',
  COD = 'Cash on Delivery',
  NET_BANKING = 'Net Banking'
}
