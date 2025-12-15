import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Bot, Sparkles, Camera, ArrowLeft, Shirt, ScanFace, CheckCircle2, AlertCircle } from 'lucide-react';
import { PRODUCTS } from '../constants';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

type BodyType = 'Hourglass' | 'Rectangle' | 'Inverted Triangle' | 'Pear' | 'Apple' | 'Athletic';

interface AnalysisResult {
  bodyType: BodyType;
  measurements: {
    shoulder: number;
    waist: number;
    hips: number;
  };
  recommendation: string;
}

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'stylist'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi there! I'm your AI Shopping Assistant. I can help you find products or fashion styles. What are you looking for today?",
      timestamp: Date.now(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Stylist State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Gemini Client
  // Note: In a production app, ensure this is handled securely (e.g., via backend proxy)
  // if you cannot use a public key restriction.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isThinking, mode]);

  // Clean up camera on unmount or close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // --- Chat Logic ---

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    try {
      // Create a context-aware system prompt
      const productContext = PRODUCTS.map(p => 
        `- ${p.name} (${p.category}): $${p.price}. ${p.description}`
      ).join('\n');

      const systemInstruction = `
        You are a friendly, enthusiastic AI shopping assistant for BlueOak.in.
        
        Available Products:
        ${productContext}
        
        Rules:
        1. Recommend products from the list above if they match the user's need.
        2. If the user asks about something we don't have, suggest the closest category (Electronics, Fashion, Home).
        3. Be concise (max 2-3 sentences).
        4. Use emojis occasionally.
        5. If the user mentions "style" or "fashion advice", suggest they try the "Virtual Stylist" mode (camera icon).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
        contents: [
            {
                role: 'user',
                parts: [{ text: userMessage.text }]
            }
        ]
      });

      const botText = response.text || "I'm having trouble connecting to the catalog right now. Please try again!";

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: botText,
        timestamp: Date.now(),
      }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Oops! My brain froze for a second. Could you repeat that?",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isThinking) {
      handleSend();
    }
  };

  // --- Stylist Logic ---

  const startCamera = async () => {
    try {
      setAnalysisResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video metadata to load to prevent 0x0 captures
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.log("Auto-play blocked:", e));
        };
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Unable to access camera. Please allow camera permissions to use the Stylist.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Safety check: ensure video is ready
    if (videoRef.current.readyState !== 4) { // HAVE_ENOUGH_DATA
        console.warn("Video not ready for capture yet.");
        return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Match canvas size to video resolution
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current frame
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get Base64 string with slightly reduced quality (0.8) to prevent payload size errors
    const base64DataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const base64Image = base64DataUrl.split(',')[1];

    if (!base64Image) {
        alert("Failed to capture image. Please try again.");
        return;
    }

    // Pause stream visually to indicate capture (shutter effect)
    video.pause();
    setIsAnalyzing(true);

    try {
      // Call Gemini Vision
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image
                }
              },
              {
                text: `
                  Analyze the person in this image to determine their approximate body shape for fashion advice.
                  
                  Return a valid JSON object with NO markdown formatting. Structure:
                  {
                    "bodyType": "Hourglass" | "Rectangle" | "Inverted Triangle" | "Pear" | "Apple" | "Athletic",
                    "measurements": { "shoulder": number, "waist": number, "hips": number },
                    "recommendation": "A short, helpful fashion tip specific to this body type."
                  }
                  
                  Estimate measurements (in inches) based on visual proportions.
                `
              }
            ]
          }
        ]
      });

      // Parse Response
      let text = response.text || "";
      // Clean up markdown code blocks if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const result: AnalysisResult = JSON.parse(text);
      setAnalysisResult(result);
      
      // Stop camera ONLY on success to switch to result view
      stopCamera();

    } catch (error) {
      console.error("Analysis Error:", error);
      alert("I couldn't quite see that clearly. Please try again with better lighting!");
      
      // Resume video if failed so user can try again
      // catch() prevents "play() request was interrupted" error if component unmounts
      video.play().catch(e => console.debug("Resume video interrupted:", e));
    } finally {
      setIsAnalyzing(false);
      // NOTE: Do not stopCamera() here, as we want to keep it running on error for retries
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    stopCamera();
  };

  const handleModeSwitch = (newMode: 'chat' | 'stylist') => {
    setMode(newMode);
    if (newMode === 'chat') {
        stopCamera();
    }
  };

  return (
    <>
      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
            if (isOpen) handleClose();
            else setIsOpen(true);
        }}
        className={`fixed bottom-6 right-6 z-[100] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center
          ${isOpen ? 'bg-gray-200 text-gray-800 rotate-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window Container */}
      <div 
        className={`fixed bottom-24 right-6 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] transition-all duration-300 origin-bottom-right flex flex-col
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
        `}
        style={{ height: '500px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              {mode === 'chat' ? <Bot className="text-white w-5 h-5" /> : <Shirt className="text-white w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {mode === 'chat' ? 'AI Shopping Assistant' : 'Virtual Stylist'}
              </h3>
              <p className="text-indigo-100 text-[10px] flex items-center">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          
          {/* Mode Toggle Button */}
          {mode === 'chat' ? (
             <button 
               onClick={() => handleModeSwitch('stylist')}
               className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold py-1.5 px-3 rounded-full flex items-center gap-1 transition-colors"
               title="Open Virtual Stylist"
             >
               <Camera size={12} /> Stylist
             </button>
          ) : (
             <button 
               onClick={() => handleModeSwitch('chat')}
               className="text-white/80 hover:text-white transition-colors"
               title="Back to Chat"
             >
               <ArrowLeft size={20} />
             </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
          
          {/* --- CHAT MODE CONTENT --- */}
          {mode === 'chat' && (
            <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                    <div 
                        className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm
                        ${msg.sender === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
                        `}
                    >
                        {msg.text}
                    </div>
                    </div>
                ))}
                
                {isThinking && (
                    <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                <div className="relative">
                    <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isThinking}
                    placeholder="Ask about products..."
                    className="w-full bg-gray-100 text-gray-800 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                    />
                    <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || isThinking}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                    <Send size={14} />
                    </button>
                </div>
                </div>
            </>
          )}

          {/* --- STYLIST MODE CONTENT --- */}
          {mode === 'stylist' && (
            <div className="flex flex-col h-full bg-black">
                {/* Camera / Visual Area */}
                <div className="flex-1 relative overflow-hidden bg-gray-900 flex items-center justify-center group">
                    
                    {!isCameraActive && !analysisResult && !isAnalyzing && (
                        <div className="text-center p-6 animate-fade-in">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                                <ScanFace className="text-indigo-400 w-8 h-8" />
                            </div>
                            <h3 className="text-white font-bold mb-2">AI Body Analysis</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-[200px] mx-auto">
                                Enable your camera to analyze your body type and get the perfect fit recommendations.
                            </p>
                            <button 
                                onClick={startCamera}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full text-sm transition-all shadow-lg hover:shadow-indigo-500/30"
                            >
                                Start Camera
                            </button>
                        </div>
                    )}

                    {(isCameraActive || isAnalyzing) && !analysisResult && (
                        <>
                             <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isAnalyzing ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                            />
                            
                            {/* Overlay Guides */}
                            <div className="absolute inset-0 border-2 border-white/30 rounded-lg m-8 pointer-events-none">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
                            </div>

                            {!isAnalyzing && (
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                                    <button 
                                        onClick={captureAndAnalyze}
                                        className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <div className="w-12 h-12 bg-indigo-600 rounded-full border-2 border-white"></div>
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {isAnalyzing && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="text-center p-6">
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-ping"></div>
                                    <div className="relative w-full h-full bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center border-2 border-indigo-500">
                                        <Sparkles className="text-indigo-400 animate-spin-slow" />
                                    </div>
                                </div>
                                <h3 className="text-white font-bold animate-pulse">Analyzing Silhouette...</h3>
                                <p className="text-gray-300 text-xs mt-2">Processing with Gemini Vision</p>
                            </div>
                        </div>
                    )}

                    {analysisResult && (
                        <div className="absolute inset-0 bg-white flex flex-col animate-slide-up p-5 overflow-y-auto z-30">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-2">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Analysis Complete</h3>
                                <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mt-1">
                                    {analysisResult.bodyType} Body Type
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                                    Est. Measurements (Inches)
                                    <AlertCircle size={10} className="ml-1 text-gray-400" />
                                </h4>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <div className="text-lg font-bold text-gray-800">{analysisResult.measurements.shoulder}</div>
                                        <div className="text-[10px] text-gray-500">Shoulder</div>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg shadow-sm border border-indigo-100">
                                        <div className="text-lg font-bold text-indigo-600">{analysisResult.measurements.waist}</div>
                                        <div className="text-[10px] text-gray-500">Waist</div>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <div className="text-lg font-bold text-gray-800">{analysisResult.measurements.hips}</div>
                                        <div className="text-[10px] text-gray-500">Hips</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 mb-6">
                                <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
                                    <Sparkles size={14} className="mr-1" /> Stylist's Verdict
                                </h4>
                                <p className="text-sm text-indigo-800 leading-relaxed italic">
                                    "{analysisResult.recommendation}"
                                </p>
                            </div>

                            <button 
                                onClick={() => {
                                    setMode('chat');
                                    setMessages(prev => [...prev, {
                                        id: Date.now().toString(),
                                        sender: 'bot',
                                        text: `My analysis detected an ${analysisResult.bodyType} shape. ${analysisResult.recommendation}`,
                                        timestamp: Date.now()
                                    }]);
                                }}
                                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Shop Recommendations
                            </button>
                            <button 
                                onClick={() => {
                                    setAnalysisResult(null);
                                    startCamera();
                                }}
                                className="w-full mt-3 text-gray-500 text-sm font-medium hover:text-gray-700 py-2"
                            >
                                Retake Analysis
                            </button>
                        </div>
                    )}
                </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AIChatBot;