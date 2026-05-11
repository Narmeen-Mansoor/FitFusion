import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Activity, HelpCircle, Save, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../hooks/useFirebase';
import { GoogleGenAI } from "@google/genai";

export default function BMICalculator() {
  const { userProfile, setUserProfile } = useAuth();
  const { updateDocument } = useFirebase();
  const [formData, setFormData] = useState({
    height: userProfile?.height || '',
    weight: userProfile?.weight || '',
    age: userProfile?.age || '',
    gender: userProfile?.gender || 'male'
  });
  const [bmi, setBmi] = useState(userProfile?.bmi || null);
  const [category, setCategory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const calculateBMI = async (e) => {
    e.preventDefault();
    const h = formData.height / 100;
    const w = formData.weight;
    const result = (w / (h * h)).toFixed(1);
    setBmi(result);
    
    let cat = '';
    if (result < 18.5) cat = 'Underweight';
    else if (result < 25) cat = 'Normal';
    else if (result < 30) cat = 'Overweight';
    else cat = 'Obese';
    setCategory(cat);

    // Get AI Suggestions
    try {
      setLoading(true);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `As a fitness expert, provide 3 brief health suggestions for a ${formData.age} year old ${formData.gender} with a BMI of ${result} (${cat}). Keep it professional and encouraging.`;
      const response = await ai.models.getGenerativeModel({ model: "gemini-2.0-flash" }).generateContent(prompt);
      setAiSuggestions(response.response.text());
    } catch (err) {
      console.error(err);
      setAiSuggestions("Consider consulting with a professional for a personalized fitness plan.");
    } finally {
      setLoading(false);
    }
  };

  const saveToProfile = async () => {
    try {
      setSaving(true);
      const updatedData = { ...formData, bmi: parseFloat(bmi) };
      await updateDocument('users', userProfile.uid, updatedData);
      setUserProfile(prev => ({ ...prev, ...updatedData }));
      alert('BMI and profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Biometric Analysis</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Body Mass Index & Morphological Logic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Card */}
        <div className="lg:col-span-5 p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-3xl -z-10"></div>
          <form onSubmit={calculateBMI} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Stature (CM)</label>
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-lime-400 outline-none text-white font-bold transition-all"
                  placeholder="175"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Mass (KG)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-lime-400 outline-none text-white font-bold transition-all"
                  placeholder="70"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Age (Chronological)</label>
                <input 
                   type="number" 
                   value={formData.age}
                   onChange={(e) => setFormData({...formData, age: e.target.value})}
                   className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-lime-400 outline-none text-white font-bold transition-all"
                   placeholder="25"
                   required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Phenotype</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-lime-400 outline-none text-white font-bold transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(163,230,53,0.3)] uppercase tracking-[0.2em] text-xs"
            >
              <Calculator className="w-5 h-5" />
              Execute Scan
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-7 space-y-6">
          {bmi ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 bg-white/5 border border-white/10 rounded-[48px] h-full flex flex-col shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-lime-400 to-blue-500 opacity-50"></div>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
                  <Activity className="text-lime-400 w-6 h-6" />
                  Synthesis Result
                </h3>
                <button 
                  onClick={saveToProfile}
                  disabled={saving}
                  className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all bg-white/5 px-4 py-2 rounded-xl"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Commit to Profile</>}
                </button>
              </div>

              <div className="text-center py-12 border-b border-white/5 mb-10 bg-white/[0.02] rounded-[32px] border border-white/5 shadow-inner">
                <div className="text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{bmi}</div>
                <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border ${
                  category === 'Normal' ? 'bg-lime-400/10 text-lime-400 border-lime-400/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${category === 'Normal' ? 'bg-lime-400' : 'bg-red-400'}`}></div>
                  {category} Status
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-[10px] font-black text-slate-500 flex items-center gap-3 mb-6 uppercase tracking-[0.3em]">
                  <Sparkles className="w-4 h-4 text-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
                  Neural Insights
                </h4>
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-10 h-10 animate-spin text-lime-400" />
                  </div>
                ) : (
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-slate-300 leading-relaxed font-medium space-y-4 whitespace-pre-wrap italic text-sm">
                    {aiSuggestions || "Initiate scan to retrieve generative biometrics."}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="p-16 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[48px] h-full flex flex-col items-center justify-center text-center group transition-all hover:bg-white/[0.02] hover:border-white/10">
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform">
                <Calculator className="w-12 h-12 text-slate-600 group-hover:text-lime-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Awaiting Scan</h3>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed">Enter morphological parameters to initialize BMI assessment and generative health advice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
