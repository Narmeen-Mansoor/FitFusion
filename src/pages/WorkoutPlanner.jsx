import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Target, Clock, Zap, Loader2, Save, Wand2, CheckCircle2 } from 'lucide-react';
import { generateWorkoutPlan } from '../services/gemini';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../hooks/useFirebase';

export default function WorkoutPlanner() {
  const { userProfile } = useAuth();
  const { addDocument } = useFirebase();
  const [formData, setFormData] = useState({
    goal: 'muscle_gain',
    fitnessLevel: 'beginner',
    equipment: 'full_gym',
    duration: '45',
    age: userProfile?.age || 25,
    gender: userProfile?.gender || 'male',
    weight: userProfile?.weight || 70,
    height: userProfile?.height || 175
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generatedPlan = await generateWorkoutPlan(formData);
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
        type: 'workout',
        title: plan.title,
        content: plan,
        createdAt: new Date().toISOString()
      });
      alert('Plan saved to your collection!');
    } catch (err) {
      alert('Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">AI Workout Architecture</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Generative Neural Net Training Systems</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-3xl -z-10"></div>
            <form onSubmit={handleGenerate} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Target Protocol</label>
                <select 
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lime-400 transition-all font-bold text-sm"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="strength_training">Strength Training</option>
                  <option value="cardio">Cardio Endurance</option>
                  <option value="flexibility">Flexibility & Yoga</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Competency Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({...formData, fitnessLevel: lvl})}
                      className={`py-3 px-1 text-[10px] font-black border rounded-xl transition-all uppercase tracking-widest ${
                        formData.fitnessLevel === lvl 
                          ? 'bg-lime-400 border-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Hardware Availability</label>
                <select 
                  value={formData.equipment}
                  onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lime-400 transition-all font-bold text-sm"
                >
                  <option value="full_gym">Full Gym</option>
                  <option value="dumbbells_only">Dumbbells Only</option>
                  <option value="bodyweight">Bodyweight Only</option>
                  <option value="home_training">Home (Bands/Dumbbells)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex justify-between">
                  Clock Duration 
                  <span className="text-lime-400">{formData.duration} MIN</span>
                </label>
                <input 
                  type="range" min="15" max="120" step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-lime-400 cursor-pointer"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(163,230,53,0.2)] uppercase tracking-[0.2em] text-xs group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Initiate Synthesis</>}
              </button>
            </form>
          </div>
        </div>

        {/* Plan Result */}
        <div className="lg:col-span-8">
          {plan ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-lime-400 via-emerald-500 to-blue-500 opacity-50"></div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">{plan.title}</h2>
                  <p className="text-slate-500 text-sm font-medium mt-2 max-w-xl">{plan.description}</p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-3 transition-all shrink-0"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Routine</>}
                </button>
              </div>

              <div className="space-y-8">
                {Object.entries(plan.schedule).map(([day, data]) => (
                  <div key={day} className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[12px] font-black text-lime-400 uppercase tracking-[0.3em]">{day}</span>
                      <div className="h-px flex-1 bg-white/10"></div>
                      <span className="text-[10px] bg-white/5 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/5">
                        {data.exercises.length} Exercises
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {data.exercises.length > 0 ? (
                        data.exercises.map((ex, idx) => (
                          <motion.div 
                            key={idx} 
                            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                            className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-white/10 transition-all"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                               <span className="text-sm font-black text-slate-500">{(idx + 1).toString().padStart(2, '0')}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-white text-lg mb-1">{ex.name}</div>
                              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed">{ex.description}</p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <div className="px-4 py-2 bg-blue-500/10 rounded-xl font-black text-[10px] text-blue-400 uppercase tracking-widest">{ex.sets} Sets</div>
                              <div className="px-4 py-2 bg-lime-400/10 rounded-xl font-black text-[10px] text-lime-400 uppercase tracking-widest">{ex.reps} Reps</div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-8 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 text-center">
                          <p className="text-slate-600 text-sm font-black uppercase tracking-widest italic">{data.notes || 'RECOVERY PROTOCOL INITIATED'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center p-12 text-center group transition-all hover:bg-white/[0.02] hover:border-white/10">
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <Dumbbell className="w-10 h-10 text-slate-600 group-hover:text-lime-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">System Idle</h3>
              <p className="text-slate-500 max-w-xs font-medium leading-relaxed">Awaiting biometric input parameters to synthesize training protocol.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
