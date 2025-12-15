import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Category, Product } from '../types';
import { ArrowRight, Zap, Shirt, Home as HomeIcon, Search, Briefcase, Plane, Heart, Coffee, X, LayoutGrid } from 'lucide-react';
import { MagicCard, MagicGrid } from '../components/MagicUI';
import BlurText from '../components/BlurText';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  
  return (
    <MagicCard
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm cursor-pointer flex flex-col h-full !overflow-hidden p-0"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-md shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </MagicCard>
  );
};

const ListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories: Category[] = ['Electronics', 'Fashion', 'Home'];

  const quickFilters = [
    { 
      id: 'All', 
      label: 'All Items', 
      icon: <LayoutGrid size={16} />,
      image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=500&auto=format&fit=crop&q=60' // Product collection flatlay
    },
    { 
      id: 'Work', 
      label: 'Work From Home', 
      icon: <Briefcase size={16} />, 
      keywords: ['desk', 'monitor', 'headphone', 'laptop', 'wifi', 'noise'],
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=60' // Office
    },
    { 
      id: 'Travel', 
      label: 'Travel Ready', 
      icon: <Plane size={16} />, 
      keywords: ['portable', 'wireless', 'battery', 'travel', 'bag', 'camera'],
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60' // Travel
    },
    { 
      id: 'Fitness', 
      label: 'Fitness & Health', 
      icon: <Heart size={16} />, 
      keywords: ['watch', 'running', 'sneaker', 'health', 'gym', 'sport'],
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60' // Gym
    },
    { 
      id: 'Relax', 
      label: 'Cozy & Relax', 
      icon: <Coffee size={16} />, 
      keywords: ['blanket', 'vase', 'lamp', 'diffuser', 'candle', 'book'],
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&auto=format&fit=crop&q=60' // Cozy
    },
  ];

  const getCategoryIcon = (cat: Category) => {
    switch(cat) {
      case 'Electronics': return <Zap className="w-6 h-6 text-yellow-500" />;
      case 'Fashion': return <Shirt className="w-6 h-6 text-pink-500" />;
      case 'Home': return <HomeIcon className="w-6 h-6 text-green-500" />;
    }
  };

  // Filter Logic
  const filteredProducts = PRODUCTS.filter(product => {
    // 1. Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(query) || 
                          product.description.toLowerCase().includes(query) ||
                          product.category.toLowerCase().includes(query);
    
    if (!matchesSearch) return false;

    // 2. Active Tag Filter
    if (activeFilter === 'All') return true;
    
    const filterConfig = quickFilters.find(f => f.id === activeFilter);
    if (!filterConfig || !filterConfig.keywords) return true;

    const matchesTag = filterConfig.keywords.some(k => 
      product.name.toLowerCase().includes(k) || 
      product.description.toLowerCase().includes(k) ||
      product.category.toLowerCase().includes(k) ||
      product.features.some(f => f.toLowerCase().includes(k))
    );
    
    return matchesTag;
  });

  const isFiltering = searchQuery.length > 0 || activeFilter !== 'All';

  return (
    <div className="space-y-12 pb-12 animate-fade-in">
      {/* Hero & Search Section */}
      <div className="text-center max-w-5xl mx-auto pt-8 px-4">
        <div className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-8 drop-shadow-lg flex flex-col items-center">
            <BlurText 
                text="Everything you need," 
                delay={150} 
                animateBy="words" 
                direction="top"
                className="justify-center"
            />
            <BlurText 
                text="all in one place." 
                delay={150} 
                animateBy="words" 
                direction="top" 
                className="text-indigo-300 justify-center"
            />
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg shadow-indigo-500/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            placeholder="Search for headphones, shoes, or decor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Browse by Need (Image Boxes) */}
        <div className="mb-4">
          <h2 className="text-left text-lg font-semibold text-white mb-4 px-1 drop-shadow-md">Browse by Need</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickFilters.map((filter) => (
              <MagicCard
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  h-32 md:h-40 !rounded-2xl cursor-pointer p-0 !overflow-hidden
                  ${activeFilter === filter.id 
                    ? 'ring-4 ring-indigo-500 ring-offset-2 scale-[1.02]' 
                    : ''}
                `}
                enableTilt={true}
              >
                {/* Background Image */}
                <img 
                  src={filter.image} 
                  alt={filter.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                
                {/* Overlay */}
                <div className={`
                  absolute inset-0 transition-opacity duration-300
                  ${activeFilter === filter.id ? 'bg-indigo-900/60' : 'bg-black/40 hover:bg-black/50'}
                `} />

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <div className={`
                    mb-1 p-1.5 rounded-lg w-fit backdrop-blur-md
                    ${activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white'}
                  `}>
                     {filter.icon || <Search size={16} />}
                  </div>
                  <span className="text-white font-bold text-sm md:text-base leading-tight shadow-sm">
                    {filter.label}
                  </span>
                </div>
              </MagicCard>
            ))}
          </div>
        </div>
      </div>

      {/* Product Display Logic */}
      {isFiltering ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200/20 pb-4">
            <h2 className="text-xl font-bold text-white drop-shadow-sm">
              {filteredProducts.length} Result{filteredProducts.length !== 1 && 's'} Found
            </h2>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
              className="text-sm text-indigo-300 hover:text-indigo-200 hover:underline font-medium"
            >
              Clear Filters
            </button>
          </div>
          
          {filteredProducts.length > 0 ? (
            <MagicGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </MagicGrid>
          ) : (
            <div className="text-center py-20 bg-white/95 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-800 text-lg">No products match your specific criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                className="mt-4 text-indigo-800 font-bold hover:underline"
              >
                Reset Search
              </button>
            </div>
          )}
        </section>
      ) : (
        // Default Categorized View
        categories.map((category) => (
          <section key={category} className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-gray-200/20 pb-4">
              <div className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm">
                {getCategoryIcon(category)}
              </div>
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">{category}</h2>
            </div>

            <MagicGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PRODUCTS.filter(p => p.category === category).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </MagicGrid>
          </section>
        ))
      )}
    </div>
  );
};

export default ListingPage;