import { Product } from './types';

export const PRODUCTS: Product[] = [
  // Electronics
  {
    id: 'e1',
    name: 'Wireless Noise-Canceling Headphones',
    price: 249.99,
    category: 'Electronics',
    description: 'Experience pure sound with our premium wireless headphones. Featuring advanced active noise cancellation, these headphones block out the world so you can focus on your music. With a 30-hour battery life and plush ear cushions, they are perfect for long journeys or deep work sessions.',
    features: ['Active Noise Cancellation', '30-hour Battery Life', 'Bluetooth 5.2', 'USB-C Fast Charging'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '2.5%',
      returnRate: '1.8%',
      avgCancellationTime: '3 hours post-order',
      successfulOrders: 4821,
      satisfactionTrend: [92, 94, 93, 95, 96, 98]
    },
    reviews: {
      rating: 4.8,
      count: 1240,
      pros: ['Exceptional noise cancellation', 'Very comfortable for long wear', 'Premium build quality'],
      cons: ['Slightly bulky case', 'Pricey compared to rivals', 'Touch controls can be sensitive']
    }
  },
  {
    id: 'e2',
    name: 'Pro Series Smartwatch',
    price: 199.99,
    category: 'Electronics',
    description: 'Stay connected and healthy with the Pro Series Smartwatch. Track your workouts, monitor your heart rate, and receive notifications directly on your wrist. Its sleek, water-resistant design makes it suitable for any occasion, from the gym to the boardroom.',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant (50m)', 'Always-on Retina Display'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '3.1%',
      returnRate: '2.5%',
      avgCancellationTime: '5 hours post-order',
      successfulOrders: 3150,
      satisfactionTrend: [85, 87, 88, 86, 90, 92]
    },
    reviews: {
      rating: 4.6,
      count: 856,
      pros: ['Bright, clear display', 'Accurate fitness tracking', 'Waterproof design'],
      cons: ['Battery life under 24h', 'Proprietary charger', 'Limited third-party apps']
    }
  },
  {
    id: 'e3',
    name: 'Ultra-Portable Power Bank',
    price: 49.99,
    category: 'Electronics',
    description: 'Never run out of battery again with our Ultra-Portable Power Bank. Compact enough to fit in your pocket but powerful enough to charge your smartphone multiple times. It features dual USB ports for simultaneous charging and an LED indicator to show remaining power.',
    features: ['10,000mAh Capacity', 'Dual USB Output', 'Compact Design', 'Overcharge Protection'],
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '1.2%',
      returnRate: '0.5%',
      avgCancellationTime: '1 hour post-order',
      successfulOrders: 12050,
      satisfactionTrend: [95, 96, 96, 97, 98, 99]
    },
    reviews: {
      rating: 4.9,
      count: 2300,
      pros: ['Very compact', 'Fast charging', 'Durable finish'],
      cons: ['Short included cable', 'Gets slightly warm', 'No USB-C output']
    }
  },
  {
    id: 'e4',
    name: '360° Bluetooth Speaker',
    price: 89.99,
    category: 'Electronics',
    description: 'Bring the party anywhere with this rugged 360° Bluetooth Speaker. Delivering immersive sound in every direction, it is waterproof, dustproof, and drop-proof. Pair two speakers together for stereo sound and enjoy up to 12 hours of playtime on a single charge.',
    features: ['360° Surround Sound', 'IP67 Waterproof', '12-hour Playtime', 'Stereo Pairing Mode'],
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '4.5%',
      returnRate: '3.2%',
      avgCancellationTime: '6 hours post-order',
      successfulOrders: 1890,
      satisfactionTrend: [82, 80, 85, 88, 87, 89]
    },
    reviews: {
      rating: 4.4,
      count: 560,
      pros: ['Loud volume', 'Really waterproof', 'Cool design'],
      cons: ['Bass could be deeper', 'Distortion at max volume', 'Heavy']
    }
  },

  // Fashion
  {
    id: 'f1',
    name: 'Vintage Denim Jacket',
    price: 89.99,
    category: 'Fashion',
    description: 'A timeless classic, this vintage-wash denim jacket is perfect for layering. Made from 100% durable cotton with sturdy metal buttons and contrast stitching. It features a relaxed fit that looks great over t-shirts or hoodies.',
    features: ['100% Cotton Denim', 'Vintage Wash Finish', 'Relaxed Fit', '4-Pocket Design'],
    imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '6.2%',
      returnRate: '8.5%', // Sizing issues often cause returns in fashion
      avgCancellationTime: '12 hours post-order',
      successfulOrders: 850,
      satisfactionTrend: [88, 89, 87, 91, 92, 93]
    },
    reviews: {
      rating: 4.7,
      count: 320,
      pros: ['Classic look', 'High quality denim', 'Fits true to size'],
      cons: ['Stiff at first', 'Buttons are tight', 'No inside pockets']
    }
  },
  {
    id: 'f2',
    name: 'Urban Running Sneakers',
    price: 129.99,
    category: 'Fashion',
    description: 'Hit the streets in style and comfort with these Urban Running Sneakers. Featuring breathable mesh uppers and responsive foam cushioning, they provide support for all-day wear. The modern aesthetic makes them versatile enough for workouts or casual outings.',
    features: ['Breathable Mesh Upper', 'Responsive Foam Sole', 'Lightweight Design', 'High-Traction Grip'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '8.5%',
      returnRate: '12.0%',
      avgCancellationTime: '24 hours post-order',
      successfulOrders: 2100,
      satisfactionTrend: [75, 78, 82, 85, 88, 90]
    },
    reviews: {
      rating: 4.5,
      count: 1100,
      pros: ['Extremely comfortable', 'Stylish colors', 'Breathable'],
      cons: ['Run slightly small', 'Laces come undone', 'Hard to clean']
    }
  },
  {
    id: 'f3',
    name: 'Premium Cotton Tee',
    price: 29.99,
    category: 'Fashion',
    description: 'The essential basic you need in your wardrobe. Crafted from ultra-soft, organic cotton, this t-shirt offers a comfortable fit that holds its shape wash after wash. Available in a neutral color palette to match anything.',
    features: ['100% Organic Cotton', 'Pre-shrunk Fabric', 'Tailored Fit', 'Tag-free Comfort'],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '1.8%',
      returnRate: '2.0%',
      avgCancellationTime: '2 hours post-order',
      successfulOrders: 8900,
      satisfactionTrend: [90, 91, 92, 91, 93, 94]
    },
    reviews: {
      rating: 4.3,
      count: 4500,
      pros: ['Soft material', 'Good fit', 'Cheap'],
      cons: ['Colors fade slightly', 'Thin fabric', 'Shrinks in hot wash']
    }
  },
  {
    id: 'f4',
    name: 'Classic Leather Satchel',
    price: 159.99,
    category: 'Fashion',
    description: 'Elevate your daily carry with this hand-stitched leather satchel. Spacious enough for a 13-inch laptop and daily essentials, it features an adjustable shoulder strap and brass hardware for a sophisticated look that improves with age.',
    features: ['Genuine Full-Grain Leather', 'Laptop Compartment', 'Adjustable Strap', 'Brass Hardware'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '4.0%',
      returnRate: '3.5%',
      avgCancellationTime: '8 hours post-order',
      successfulOrders: 540,
      satisfactionTrend: [95, 96, 97, 98, 98, 99]
    },
    reviews: {
      rating: 4.9,
      count: 120,
      pros: ['Beautiful leather', 'Sturdy construction', 'Professional look'],
      cons: ['Heavy when empty', 'Strap is stiff', 'Expensive']
    }
  },

  // Home
  {
    id: 'h1',
    name: 'Minimalist Ceramic Vase',
    price: 34.99,
    category: 'Home',
    description: 'Add a touch of elegance to any room with this Minimalist Ceramic Vase. Its matte textured finish and organic shape make it a stunning centerpiece, whether filled with fresh blooms or standing alone as a sculptural piece.',
    features: ['Handcrafted Ceramic', 'Matte Textured Finish', 'Watertight', 'Modern Design'],
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '3.5%',
      returnRate: '5.2%', // Breakage risk
      avgCancellationTime: '4 hours post-order',
      successfulOrders: 1100,
      satisfactionTrend: [88, 85, 87, 89, 90, 92]
    },
    reviews: {
      rating: 4.6,
      count: 210,
      pros: ['Unique texture', 'Great size', 'Looks expensive'],
      cons: ['Fragile', 'Narrow opening', 'Color varies slightly']
    }
  },
  {
    id: 'h2',
    name: 'Aroma Diffuser & Humidifier',
    price: 45.99,
    category: 'Home',
    description: 'Create a calming atmosphere with this ultrasonic aroma diffuser. It doubles as a humidifier to improve air quality while filling your space with your favorite essential oil scents. Features quiet operation and ambient LED lighting.',
    features: ['Ultrasonic Technology', 'Auto Shut-off', 'Ambient LED Light', 'Whisper-quiet'],
    imageUrl: 'https://images.unsplash.com/photo-1608508644127-5364d0089a45?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '2.9%',
      returnRate: '3.0%',
      avgCancellationTime: '3 hours post-order',
      successfulOrders: 3400,
      satisfactionTrend: [91, 92, 90, 93, 94, 95]
    },
    reviews: {
      rating: 4.4,
      count: 980,
      pros: ['Very quiet', 'Nice lights', 'Effective mist'],
      cons: ['Small water tank', 'Beeps when setting', 'Plastic feel']
    }
  },
  {
    id: 'h3',
    name: 'Modern Desk Lamp',
    price: 65.00,
    category: 'Home',
    description: 'Illuminate your workspace with this sleek Modern Desk Lamp. It features adjustable brightness levels and color temperatures to reduce eye strain. The flexible arm allows you to direct light exactly where you need it.',
    features: ['Dimmable LED', '3 Color Temperatures', 'Touch Control', 'USB Charging Port'],
    imageUrl: 'https://images.unsplash.com/photo-1507473886388-c633a0c645d8?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '1.5%',
      returnRate: '1.2%',
      avgCancellationTime: '2 hours post-order',
      successfulOrders: 1560,
      satisfactionTrend: [94, 95, 95, 96, 97, 97]
    },
    reviews: {
      rating: 4.7,
      count: 430,
      pros: ['Bright light', 'USB port is handy', 'Sleek design'],
      cons: ['Touch button sensitive', 'Base collects dust', 'Short cord']
    }
  },
  {
    id: 'h4',
    name: 'Soft Knit Throw Blanket',
    price: 55.99,
    category: 'Home',
    description: 'Cozy up with our Soft Knit Throw Blanket. Made from a premium acrylic blend, it is incredibly soft to the touch and warm. The chunky knit texture adds a layer of visual interest to your sofa or bed.',
    features: ['Chunky Knit Texture', 'Super Soft Material', 'Machine Washable', '50x60 inches'],
    imageUrl: 'https://images.unsplash.com/photo-1580301762395-987d9760b330?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '5.1%',
      returnRate: '4.5%',
      avgCancellationTime: '10 hours post-order',
      successfulOrders: 2890,
      satisfactionTrend: [89, 90, 91, 91, 92, 94]
    },
    reviews: {
      rating: 4.8,
      count: 670,
      pros: ['So soft', 'Warm', 'Beautiful color'],
      cons: ['Sheds a bit', 'Snags easily', 'Dry clean recommended']
    }
  },
  {
    id: 'h5',
    name: 'Smart WiFi LED Bulb (2-Pack)',
    price: 24.99,
    category: 'Home',
    description: 'Transform your home lighting with these Smart WiFi LED Bulbs. Control color, brightness, and schedules via your smartphone or voice assistant. No hub required.',
    features: ['16 Million Colors', 'Voice Control', 'App Controlled', 'Energy Efficient'],
    imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '1.2%',
      returnRate: '2.1%',
      avgCancellationTime: '1 hour post-order',
      successfulOrders: 5600,
      satisfactionTrend: [92, 93, 94, 95, 96, 96]
    },
    reviews: {
      rating: 4.5,
      count: 1500,
      pros: ['Easy setup', 'Bright colors', 'Good app'],
      cons: ['Connectivity issues rarely', 'App UI could be better', 'Bulbs are large']
    }
  },
  {
    id: 'h6',
    name: 'Geometric Wall Shelf',
    price: 39.99,
    category: 'Home',
    description: 'Display your favorite photos and succulents on this stylish Geometric Wall Shelf. Made from durable metal wire and rustic wood, it adds a modern industrial touch to any room.',
    features: ['Modern Industrial Style', 'Easy Mounting', 'Durable Metal & Wood', 'Versatile Display'],
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '2.5%',
      returnRate: '4.0%',
      avgCancellationTime: '3 hours post-order',
      successfulOrders: 890,
      satisfactionTrend: [88, 89, 90, 91, 92, 93]
    },
    reviews: {
      rating: 4.7,
      count: 240,
      pros: ['Looks great', 'Sturdy', 'Easy to hang'],
      cons: ['Smaller than expected', 'Wood is unfinished', 'Screws visible']
    }
  },
  {
    id: 'h7',
    name: 'Bamboo Drawer Organizer',
    price: 19.99,
    category: 'Home',
    description: 'Keep your kitchen or office drawers tidy with this adjustable Bamboo Drawer Organizer. Made from sustainable bamboo, it expands to fit most drawer sizes and provides custom compartments for utensils, tools, or stationery.',
    features: ['100% Sustainable Bamboo', 'Expandable Width', 'Multipurpose Use', 'Easy to Clean'],
    imageUrl: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=800&auto=format&fit=crop&q=60',
    stats: {
      cancellationRate: '1.0%',
      returnRate: '1.5%',
      avgCancellationTime: '1 hour post-order',
      successfulOrders: 2100,
      satisfactionTrend: [93, 94, 94, 95, 96, 96]
    },
    reviews: {
      rating: 4.8,
      count: 560,
      pros: ['Very practical', 'Looks clean', 'Adjustable'],
      cons: ['Slides a bit', 'Height might be too tall for shallow drawers', 'None']
    }
  }
];
