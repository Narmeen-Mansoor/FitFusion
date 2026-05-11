import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Brain, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { chatWithCoach } from '../services/gemini';
import { useAuth } from '../context/AuthContext';

export default function CoachChat() {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      parts: [{ text: "Neural Hub initialized. I am your Fusion AI Coach, synchronized with your biometric profile. How can I optimize your performance architecture today?" }] 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
    setLoading(true);

    try {
      const response = await chatWithCoach(messages, userMessage);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Neural link interrupted. Re-synchronizing... Please restating protocol." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6 pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Neural Coach Hub</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Direct Interface / Generative Performance Logic</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-lime-400/10 border border-lime-400/20 rounded-full text-[10px] font-black text-lime-400 uppercase tracking-widest shadow-[0_0_15px_rgba(163,230,53,0.1)]">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          Uplink Active
        </div>
      </div>

      <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-[48px] overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 blur-[100px] -z-10 rounded-full"></div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl ${
                  msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>
                <div className={`max-w-[75%] p-6 rounded-[32px] text-sm leading-relaxed font-medium ${
                  msg.role === 'user' 
                    ? 'bg-white/5 border border-white/10 text-white rounded-tr-none' 
                    : 'bg-white/[0.08] border border-white/10 text-slate-100 rounded-tl-none'
                }`}>
                  {msg.parts[0].text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-lime-400 text-black flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                <Bot className="w-6 h-6" />
              </div>
              <div className="p-6 bg-white/[0.08] border border-white/10 rounded-[32px] rounded-tl-none flex items-center">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-bounce"></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-black/40 border-t border-white/10 backdrop-blur-md">
           <form onSubmit={handleSend} className="relative max-w-3xl mx-auto">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full pl-8 pr-20 py-5 bg-white/5 border border-white/10 rounded-[32px] focus:border-lime-400 focus:bg-white/[0.08] outline-none text-white transition-all shadow-inner disabled:opacity-50 text-sm font-bold"
                placeholder="Synchronize with your coach..."
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-lime-400 hover:bg-lime-500 disabled:opacity-50 text-black rounded-2xl transition-all shadow-lg hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
           </form>
           <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
             <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Enhanced Logic</span>
             <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
             <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Biometric Privacy</span>
           </div>
        </div>
      </div>
    </div>
  );
}
