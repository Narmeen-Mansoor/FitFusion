import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Utensils, Apple, Coffee, Moon, Sun, Loader2, Save, Wand2, Calculator, Info } from 'lucide-react';
import { generateMealPlan } from '../services/gemini';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../hooks/useFirebase';

export default function MealPlanner() {
  const { userProfile } = useAuth();
  const { addDocument } = useFirebase();
  const [formData, setFormData] = useState({
    goal: 'weight_loss',
    dailyCalorieGoal: userProfile?.dailyCalorieGoal || 2000,
    preferences: 'Balanced',
    weight: userProfile?.weight || 70
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generatedPlan = await generateMealPlan(formData);
      setPlan(generatedPlan);
    } catch (err) {
      alert("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      await addDocument('savedPlans', {
        type: 'meal',
        title: plan.title,
        content: plan,
        createdAt: new Date().toISOString()
      });
      alert('Meal plan saved!');
    } catch (err) {
      alert('Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  const mealIcons = {
    breakfast: <Coffee className="w-5 h-5" />,
    lunch: <Sun className="w-5 h-5" />,
    dinner: <Moon className="w-5 h-5" />,
    snack: <Apple className="w-5 h-5" />
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Nutritional Synthesis</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Metabolic Rate & Fuel Optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-3xl -z-10"></div>
            <form onSubmit={handleGenerate} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Biometric Target</label>
                <select 
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lime-400 transition-all font-bold text-sm"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Clean Muscle Gain</option>
                  <option value="maintenance">Health Maintenance</option>
                  <option value="keto">Keto Focus</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Energy Ceiling (KCAL)</label>
                <div className="relative">
                  <Calculator className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="number"
                    value={formData.dailyCalorieGoal}
                    onChange={(e) => setFormData({...formData, dailyCalorieGoal: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lime-400 transition-all font-bold text-sm"
                    placeholder="2000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Input Parameters (Allergies/Prefs)</label>
                <textarea 
                  value={formData.preferences}
                  onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                   className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lime-400 transition-all font-bold text-sm min-h-[100px] resize-none"
                  placeholder="e.g. Vegan, No Nuts, High Protein"
                />
              </div>

              <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-300 leading-relaxed font-bold uppercase tracking-widest">Neural Net will calculate precise micronutrient density optimized for cellular recovery.</p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(163,230,53,0.2)] uppercase tracking-[0.2em] text-xs group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Synthesize Plan</>}
              </button>
            </form>
          </div>
        </div>

        {/* Plan Result */}
        <div className="lg:col-span-8">
          {plan ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary Header */}
              <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-lime-400 to-emerald-500 opacity-50"></div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">{plan.title}</h2>
                  <div className="flex flex-wrap gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Energy Total</span>
                      <span className="text-2xl font-black text-white tracking-tighter">{plan.nutrition.calories}<small className="text-[10px] ml-1 text-slate-500">KCAL</small></span>
                    </div>
                    <div className="w-px h-10 bg-white/10 hidden xl:block" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">Structural</span>
                      <span className="text-2xl font-black text-white tracking-tighter">{plan.nutrition.protein}g<small className="text-[10px] ml-1 text-slate-500">PRO</small></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-lime-400 uppercase font-black tracking-widest mb-1">Kinetic</span>
                      <span className="text-2xl font-black text-white tracking-tighter">{plan.nutrition.carbs}g<small className="text-[10px] ml-1 text-slate-500">CHO</small></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-purple-400 uppercase font-black tracking-widest mb-1">Hormonal</span>
                      <span className="text-2xl font-black text-white tracking-tighter">{plan.nutrition.fats}g<small className="text-[10px] ml-1 text-slate-500">LIP</small></span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shrink-0 shadow-lg"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Protocol</>}
                </button>
              </div>

              {/* Meals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(plan.meals).map(([type, description]) => (
                  <motion.div 
                    key={type} 
                    whileHover={{ scale: 1.02 }}
                    className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:border-lime-400/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] -z-10 group-hover:bg-lime-400/5 transition-colors"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-lime-400 group-hover:text-black transition-all shadow-inner border border-white/5">
                        {mealIcons[type]}
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">{type}</h4>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center p-12 text-center group transition-all hover:bg-white/[0.02] hover:border-white/10">
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <Utensils className="w-10 h-10 text-slate-600 group-hover:text-lime-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Metabolic Hub Idle</h3>
              <p className="text-slate-500 max-w-xs font-medium leading-relaxed">System waiting for caloric and macronutrient requirements to synthesize fuel plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
