import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, Wand2, Loader2, Sparkles, Target, Calendar, Dumbbell, Utensils } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function GoalAnalysis() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!description || loading) return;

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let prompt = `Analyze this body goal description: "${description}". 
      Provide a comprehensive strategy including:
      1. Workout strategy (High level focus)
      2. Meal strategy (Macro focus)
      3. Estimated timeline (Realistic months)
      4. Recommended routines (Top 3 activity types)
      
      Return as a structured JSON with keys: workoutStrategy, mealStrategy, timeline, recommendedRoutines (array of strings).`;

      const parts = [{ text: prompt }];

      if (image) {
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(image);
          });
          const base64Data = await base64Promise;
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: image.type
            }
          });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: parts },
        config: {
            responseMimeType: "application/json"
        }
      });
      
      setResult(JSON.parse(response.text.trim()));
    } catch (err) {
      console.error(err);
      alert("Failed to analyze goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Goal Analysis</h1>
        <p className="text-gray-400">Upload your inspiration and let AI map out your transformation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Column */}
        <div className="space-y-6">
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-xl">
             <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Body Goal / Inspiration Image</label>
             <div 
               className="relative h-64 bg-gray-950 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-colors group cursor-pointer"
               onClick={() => document.getElementById('image-upload').click()}
             >
                {preview ? (
                  <img src={preview} alt="Goal" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-700 group-hover:text-emerald-500 transition-colors mb-2" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                  </>
                )}
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden" 
                />
             </div>

             <div className="mt-8">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Describe Your Goal</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-emerald-500 outline-none text-white min-h-[120px]"
                  placeholder="e.g. I want to build lean muscle while dropping body fat percentage. I'm aiming for a shredded athletic look like the image."
                />
             </div>

             <button 
               onClick={handleAnalyze}
               disabled={loading || !description}
               className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-5 h-5" /> Analyze & Create Strategy</>}
             </button>
          </div>
        </div>

        {/* Result Column */}
        <div>
          {result ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-xl space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-emerald-500" />
                  AI Transformation Hub
                </h3>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Custom Strategy
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800">
                    <Calendar className="w-5 h-5 text-blue-500 mb-2" />
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Timeline</div>
                    <div className="text-sm font-bold text-white">{result.timeline}</div>
                 </div>
                 <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800">
                    <Target className="w-5 h-5 text-emerald-500 mb-2" />
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Efficiency</div>
                    <div className="text-sm font-bold text-white">High Impact</div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <Dumbbell className="w-4 h-4" /> Workout Strategy
                   </h4>
                   <p className="text-sm text-gray-300 leading-relaxed">{result.workoutStrategy}</p>
                 </div>
                 <div>
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <Utensils className="w-4 h-4" /> Meal Strategy
                   </h4>
                   <p className="text-sm text-gray-300 leading-relaxed">{result.mealStrategy}</p>
                 </div>
                 <div>
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Recommended Routines</h4>
                   <div className="flex flex-wrap gap-2">
                     {result.recommendedRoutines.map((r, i) => (
                       <span key={i} className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-emerald-400 font-medium">
                         {r}
                       </span>
                     ))}
                   </div>
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-gray-600">
              <Sparkles className="w-16 h-16 mb-4 opacity-10" />
              <p>Upload your goals to unlock your personalized AI transformation strategy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
