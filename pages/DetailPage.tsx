import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';
import { useMarket } from '../context/MarketContext';
import { Check, ShieldCheck, ArrowLeft, Star, AlertCircle, TrendingUp, Package, Gift, Crown, ThumbsUp, ThumbsDown, Camera, X, Sparkles, MapPin, BellRing, User, Edit3, Lock, Unlock, Rotate3D, MoveHorizontal } from 'lucide-react';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addDeal } = useMarket();

  // --- State for Features ---
  const [showNotification, setShowNotification] = useState(false);
  
  // 360 View State
  const [show360, setShow360] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);

  // Virtual Try-On State
  const [showTryOn, setShowTryOn] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [userSpecs, setUserSpecs] = useState({
    height: '',
    weight: '',
    bodyType: 'Average'
  });

  // Review Gamification State
  const [reviewPoints, setReviewPoints] = useState(70); // Start at 70/100 as requested
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");

  // Simulated Customer Loyalty Data
  const loyaltyPoints = 1250; 

  const product = PRODUCTS.find((p) => p.id === id);

  // --- Helpers ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateCancellation = () => {
    if (product) {
      // Add deal to global context which updates the top bar
      addDeal(product);
      
      // Trigger the local notification toast
      setShowNotification(true);
      // Auto-hide after 10 seconds
      setTimeout(() => setShowNotification(false), 10000);
    }
  };

  const handleReviewSubmit = () => {
    // Validation: 20 character minimum
    if (reviewText.trim().length < 20) {
      setReviewError("Keep going! Describe your experience (min 20 chars).");
      return;
    }

    // Success logic
    const newPoints = Math.min(reviewPoints + 10, 100);
    setReviewPoints(newPoints);
    setReviewText("");
    setIsReviewFormOpen(false);
    setReviewError("");
  };

  // 360 View Handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    startX.current = clientX;
    currentRotation.current = rotation;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const delta = clientX - startX.current;
    // Sensitivity factor
    const newRotation = currentRotation.current + delta * 0.5;
    setRotation(newRotation);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const generateTryOn = async () => {
    if (!product || !userImage) return;

    setIsGenerating(true);
    setGeneratedImage(null);
    setFitScore(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare image part
      const base64Data = userImage.split(',')[1];
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg/png
          data: base64Data
        }
      };

      // Construct prompt
      const prompt = `
        Generate a photorealistic image of a person wearing the "${product.name}".
        The person in the generated image should resemble the person in the provided reference image.
        
        Body Specifications:
        - Height: ${userSpecs.height || 'Average'}
        - Weight: ${userSpecs.weight || 'Average'}
        - Body Type: ${userSpecs.bodyType}
        
        Product Description: ${product.description}
        Category: ${product.category}
        
        The image should be a high-quality fashion shot, showing how the item fits.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [imagePart, { text: prompt }]
        }
      });

      // Extract image from response
      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imgUrl = `data:image/png;base64,${part.inlineData.data}`;
            setGeneratedImage(imgUrl);
            foundImage = true;
            // Simulate a Fit Confidence Score
            setFitScore(Math.floor(Math.random() * (98 - 85 + 1)) + 85);
            break;
          }
        }
      }

      if (!foundImage) {
        console.error("No image generated");
        // Fallback for demo purposes if model returns text only
        alert("The model returned a text description instead of an image. Please try again.");
      }

    } catch (error) {
      console.error("Try-On Error:", error);
      alert("Failed to generate virtual try-on. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Logic ---

  const getCouponData = () => {
    if (loyaltyPoints > 5000) {
      return {
        type: 'VIP',
        code: 'VIPSHIP',
        message: "👑 VIP Reward! You've unlocked VIPSHIP for FREE Expedited Shipping on ALL orders!",
        color: 'bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 border-yellow-300'
      };
    } else if (loyaltyPoints > 1000) {
      return {
        type: 'LOYAL',
        code: 'LOYAL10',
        message: "🎉 Congratulations! Use code LOYAL10 for 10% off this purchase!",
        color: 'bg-indigo-50 text-indigo-900 border-indigo-100'
      };
    } else {
      return {
        type: 'NONE',
        code: null,
        message: "Earn 1,000 points to unlock your first coupon!",
        color: 'bg-gray-50 text-gray-600 border-gray-100'
      };
    }
  };

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Product not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-300 font-medium hover:underline">
          Back to Home
        </button>
      </div>
    );
  }

  const coupon = getCouponData();
  const cancelRate = parseFloat(product.stats.cancellationRate);
  const returnRate = parseFloat(product.stats.returnRate);
  const successRate = 100 - cancelRate - returnRate;

  // Graph Logic
  const trendData = product.stats.satisfactionTrend;
  const maxVal = Math.max(...trendData, 100);
  const minVal = Math.min(...trendData) - 5;
  const range = maxVal - minVal || 1;
  const width = 200; 
  const height = 60;
  const points = trendData.map((val, i) => {
    const x = (i / (trendData.length - 1)) * width;
    const y = height - ((val - minVal) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="animate-fade-in pb-12 relative">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Listings
      </button>

      {/* Localized Cancellation Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-l-4 border-indigo-600 p-4 animate-slide-up">
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-full mr-3 flex-shrink-0">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex justify-between items-center">
                Nearby Opportunity
                <span className="text-xs text-gray-400 font-normal">Just now</span>
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                A customer <strong>2.4km away</strong> just canceled their order.
              </p>
              <div className="mt-3 bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                <p className="text-indigo-900 text-sm font-bold flex items-center">
                  <BellRing className="w-4 h-4 mr-2" />
                  Sent to Top Bar Notification!
                </p>
              </div>
              <button 
                onClick={() => {
                  navigate('/nearby-deals');
                }}
                className="mt-3 w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Deal
              </button>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 ml-2">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 360 View Modal */}
      {show360 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-scale-in">
             <button onClick={() => setShow360(false)} className="absolute top-4 right-4 z-20 bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors">
               <X size={24} className="text-gray-800" />
             </button>
             
             <div className="p-6 text-center border-b border-gray-100">
                <h3 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-900">
                  <Rotate3D className="text-indigo-600" /> 360° Product Viewer
                </h3>
                <p className="text-sm text-gray-500 mt-1">Drag your mouse or swipe to rotate the product</p>
             </div>

             <div 
               className="relative h-[400px] bg-gray-50 cursor-move flex items-center justify-center perspective-1000 overflow-hidden"
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp}
               onTouchStart={handleMouseDown}
               onTouchMove={handleMouseMove}
               onTouchEnd={handleMouseUp}
             >
                {/* Simulated 3D Environment */}
                <div 
                  className="relative transition-transform duration-75 ease-out preserve-3d w-[300px] h-[300px]"
                  style={{ transform: `rotateY(${rotation}deg) rotateX(10deg)` }}
                >
                   {/* We simulate a 3D object by using the image on a card that rotates */}
                   <img 
                     src={product.imageUrl} 
                     alt="360 View"
                     className="w-full h-full object-cover rounded-xl shadow-2xl pointer-events-none border-4 border-white" 
                   />
                   {/* Back face to give it some depth feel if rotated fully */}
                   <div 
                      className="absolute inset-0 bg-indigo-900 rounded-xl backface-hidden flex items-center justify-center text-white font-bold text-2xl"
                      style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
                   >
                     BlueOak.in
                   </div>
                </div>

                {/* Interaction Hint */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg pointer-events-none flex items-center gap-2 text-sm font-semibold text-gray-700">
                   <MoveHorizontal size={16} className="animate-pulse" /> Drag to Rotate
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Virtual Try-On Modal */}
      {showTryOn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
            
            {/* Input Section */}
            <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                  Virtual Try-On
                </h2>
                <button onClick={() => setShowTryOn(false)} className="md:hidden text-gray-500">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">1. Upload Your Photo</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {userImage ? (
                      <div className="relative h-48 w-full">
                        <img src={userImage} alt="User" className="h-full w-full object-contain rounded-lg" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <span className="text-white font-medium">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Tap to upload or take a selfie</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body Specs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">2. Your Specifications</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Height (e.g. 5'9)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        value={userSpecs.height}
                        onChange={e => setUserSpecs({...userSpecs, height: e.target.value})}
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Weight (e.g. 150lbs)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        value={userSpecs.weight}
                        onChange={e => setUserSpecs({...userSpecs, weight: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <select 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        value={userSpecs.bodyType}
                        onChange={e => setUserSpecs({...userSpecs, bodyType: e.target.value})}
                      >
                        <option value="Slim">Slim</option>
                        <option value="Average">Average</option>
                        <option value="Athletic">Athletic</option>
                        <option value="Curvy">Curvy</option>
                        <option value="Plus Size">Plus Size</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={generateTryOn}
                  disabled={!userImage || isGenerating}
                  className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all
                    ${!userImage || isGenerating 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'}`}
                >
                  {isGenerating ? 'Analyzing & Generating...' : 'Visualize Fit'}
                </button>
              </div>
            </div>

            {/* Result Section */}
            <div className="p-8 md:w-1/2 bg-gray-50 flex flex-col items-center justify-center relative min-h-[400px]">
              <button onClick={() => setShowTryOn(false)} className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
              
              {isGenerating ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium animate-pulse">Creating your personalized look...</p>
                </div>
              ) : generatedImage ? (
                <div className="w-full h-full flex flex-col">
                   <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center">
                    <User className="w-5 h-5 mr-2" /> Your Personalized Fit
                   </h3>
                   <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white flex-grow">
                     <img src={generatedImage} alt="Virtual Try On Result" className="w-full h-full object-cover" />
                     
                     {/* Fit Confidence Score Overlay */}
                     {fitScore && (
                       <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-lg border border-gray-100">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Fit Confidence Score</span>
                            <span className="text-xl font-extrabold text-indigo-600">{fitScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                              style={{ width: `${fitScore}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Based on your measurements, this size is a <span className="text-green-600 font-bold">Great Match</span>.
                          </p>
                       </div>
                     )}
                   </div>
                   <button 
                    onClick={() => setShowTryOn(false)}
                    className="mt-4 text-indigo-600 font-semibold hover:underline text-center"
                   >
                     Close & Add to Cart
                   </button>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                   <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                     <Sparkles className="h-8 w-8 text-indigo-200" />
                   </div>
                   <p className="text-sm">Upload a photo and enter your stats<br/>to see how this looks on you!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative bg-gray-100 min-h-[400px] lg:h-auto group">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Action Buttons Overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 w-full justify-center px-4">
              {/* 360 View Button - Always visible */}
              <button
                onClick={() => setShow360(true)}
                className="bg-white/90 backdrop-blur text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Rotate3D size={18} className="text-indigo-600" />
                360° View
              </button>

              {/* Try On Button Overlay for Fashion Items */}
              {product.category === 'Fashion' && (
                <button 
                  onClick={() => setShowTryOn(true)}
                  className="bg-indigo-600/90 backdrop-blur text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-600 hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <Sparkles size={18} className="text-white" />
                  Try On
                </button>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
                In Stock
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center justify-between mb-8">
              <p className="text-3xl font-bold text-indigo-600">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-bold text-gray-900">{product.reviews.rating}</span>
                <span className="text-gray-500 text-sm">({product.reviews.count} reviews)</span>
              </div>
            </div>

            {/* Loyalty Section */}
            <div className={`mb-8 p-6 rounded-2xl border ${coupon.color} relative overflow-hidden`}>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide opacity-80 mb-1">Loyalty Rewards</h3>
                  <div className="font-medium text-sm mb-3">
                    Current Loyalty Points: <span className="font-bold">{loyaltyPoints.toLocaleString()}</span>
                  </div>
                  <p className="font-bold text-lg leading-tight">{coupon.message}</p>
                </div>
                {coupon.type === 'VIP' ? <Crown className="w-8 h-8 opacity-80" /> : <Gift className="w-8 h-8 opacity-80" />}
              </div>
            </div>

            <div className="prose prose-slate text-gray-600 mb-8">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            {/* Customer Trust Metrics */}
            <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                  Customer Trust Metrics
                </h3>
                {/* Simulation Trigger */}
                <button 
                  onClick={simulateCancellation}
                  className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded transition-colors"
                  title="Demo: Click to simulate a nearby order cancellation"
                >
                  Simulate Nearby Cancel
                </button>
              </div>
              
              {/* Key Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-b border-gray-200 pb-8">
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Cancellation Rate
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{product.stats.cancellationRate}</div>
                  <div className="text-[10px] text-green-600 font-medium">Lower than average</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> Avg Cancel Time
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{product.stats.avgCancellationTime}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center">
                    <Package className="w-3 h-3 mr-1" /> Successful Orders
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{product.stats.successfulOrders.toLocaleString()}</div>
                </div>
              </div>

              {/* Visualizations Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visualizations maintained from previous step */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">Order Outcomes</h4>
                    <div className="flex items-center gap-4">
                        <div className="relative w-28 h-28 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform transition-all duration-500">
                                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="3" 
                                        strokeDasharray={`${successRate} 100`} 
                                        strokeDashoffset="25"
                                        strokeLinecap="round" />
                                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#fbbf24" strokeWidth="3" 
                                        strokeDasharray={`${returnRate} 100`} 
                                        strokeDashoffset={25 - successRate} 
                                        strokeLinecap="round" />
                                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f43f5e" strokeWidth="3" 
                                        strokeDasharray={`${cancelRate} 100`} 
                                        strokeDashoffset={25 - successRate - returnRate} 
                                        strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-bold text-gray-900">{successRate.toFixed(0)}%</span>
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Success</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                                    <span className="text-gray-600 font-medium">Delivered</span>
                                </div>
                                <span className="font-bold text-gray-900">{successRate.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-amber-400 mr-1.5" />
                                    <span className="text-gray-600 font-medium">Returned</span>
                                </div>
                                <span className="font-bold text-gray-900">{returnRate.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
                                    <span className="text-gray-600 font-medium">Canceled</span>
                                </div>
                                <span className="font-bold text-gray-900">{cancelRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center justify-between">
                        Satisfaction
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">6 Month Trend</span>
                    </h4>
                    <div className="h-24 w-full relative mt-auto">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d">
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            <path d={`M${points}`} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d={`M0,${height} ${points} ${width},${height} Z`} fill="url(#gradient)" stroke="none" />
                            {trendData.map((val, i) => {
                               const x = (i / (trendData.length - 1)) * width;
                               const y = height - ((val - minVal) / range) * height;
                               return <circle key={i} cx={x} cy={y} r="3" className="fill-white stroke-emerald-500 stroke-2 hover:r-4 transition-all" />
                            })}
                        </svg>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                        <span>6 mo ago</span>
                        <span>Today</span>
                    </div>
                </div>
              </div>
            </div>

            {/* REVIEW GAMIFICATION SECTION */}
            <div className="mb-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-bold flex items-center mb-2">
                                <Star className="w-6 h-6 text-yellow-400 mr-2 fill-yellow-400" />
                                Reviewer Rewards
                            </h3>
                            <p className="text-indigo-200 text-sm">
                                The Goal Gradient Effect: You are close! Earn 10 points for every descriptive review.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 bg-white/20 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10 shadow-lg">
                            GOAL: 100 PTS
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3 flex justify-between text-sm font-bold tracking-wide">
                        <span className="text-indigo-200">Current Progress</span>
                        <span>{reviewPoints} / 100 PTS</span>
                    </div>
                    <div className="h-6 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm mb-8 border border-white/10 p-1">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000" 
                            style={{ width: `${(reviewPoints / 100) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_infinite]"></div>
                        </div>
                    </div>

                    {/* Unlock State or Interaction */}
                    {reviewPoints >= 100 ? (
                        <div className="bg-white text-indigo-900 rounded-2xl p-6 text-center animate-bounce-in shadow-2xl transform hover:scale-[1.02] transition-transform">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3 text-green-600">
                                <Unlock size={24} />
                            </div>
                            <p className="font-bold text-lg uppercase tracking-wide text-indigo-600 mb-2">Goal Reached!</p>
                            <div className="text-3xl font-mono font-black tracking-[0.2em] border-2 border-dashed border-indigo-300 rounded-xl py-4 bg-indigo-50 mb-3 text-indigo-900 select-all">
                                REWARD100
                            </div>
                            <p className="text-sm text-gray-500">Copy this code and use it at checkout for a $20 discount.</p>
                        </div>
                    ) : (
                        <div>
                            {!isReviewFormOpen ? (
                                <button 
                                    onClick={() => setIsReviewFormOpen(true)}
                                    className="w-full group bg-white text-indigo-900 font-bold py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center transform active:scale-[0.98]"
                                >
                                    <Edit3 className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
                                    Write a Review (+10 PTS)
                                </button>
                            ) : (
                                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20 animate-fade-in">
                                    <label className="block text-sm font-semibold text-indigo-100 mb-2">
                                        Your Review (min. 20 chars)
                                    </label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => {
                                            setReviewText(e.target.value);
                                            if(reviewError) setReviewError("");
                                        }}
                                        placeholder="Tell us what you loved about this product..."
                                        className="w-full bg-white/95 text-gray-900 rounded-xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-yellow-400/50 min-h-[100px] mb-3 placeholder-gray-400 shadow-inner"
                                    />
                                    {reviewError && (
                                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-3 flex items-center">
                                            <AlertCircle size={16} className="text-red-200 mr-2 flex-shrink-0" /> 
                                            <span className="text-red-100 text-sm font-medium">{reviewError}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={handleReviewSubmit}
                                            className="flex-1 bg-yellow-400 text-yellow-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg hover:shadow-yellow-400/30"
                                        >
                                            Submit Review
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setIsReviewFormOpen(false);
                                                setReviewError("");
                                            }}
                                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Customer Reviews & Ratings Summary */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Customer Reviews & Ratings
              </h3>
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 flex items-center mb-3">
                        <ThumbsUp className="w-4 h-4 mr-2" /> Pros
                      </h4>
                      <ul className="space-y-2">
                        {product.reviews.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                             <span className="mr-2 text-green-500">•</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 flex items-center mb-3">
                        <ThumbsDown className="w-4 h-4 mr-2" /> Cons
                      </h4>
                      <ul className="space-y-2">
                        {product.reviews.cons.map((con, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                             <span className="mr-2 text-red-500">•</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate('/payment')}
                className="w-full bg-indigo-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 transform transition-all duration-200 active:scale-[0.98] flex items-center justify-center"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;