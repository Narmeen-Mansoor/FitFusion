import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Flame, 
  Activity, 
  Trash2, 
  Utensils, 
  Apple, 
  Coffee, 
  Sun, 
  Moon,
  Loader2,
  Calendar
} from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';

export default function CalorieTracker() {
  const { getCollectionData, addDocument, removeDocument, loading } = useFirebase();
  const [meals, setMeals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    mealType: 'breakfast'
  });

  const fetchMeals = async () => {
    const data = await getCollectionData('meals');
    setMeals(data || []);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mealData = {
      ...formData,
      calories: Number(formData.calories),
      protein: Number(formData.protein) || 0,
      carbs: Number(formData.carbs) || 0,
      fats: Number(formData.fats) || 0,
      date: new Date().toISOString().split('T')[0]
    };

    await addDocument('meals', mealData);
    setFormData({ name: '', calories: '', protein: '', carbs: '', fats: '', mealType: 'breakfast' });
    setShowAddForm(false);
    fetchMeals();
  };

  const handleDelete = async (id) => {
    await removeDocument('meals', id);
    fetchMeals();
  };

  const totals = meals.reduce((acc, curr) => ({
    cal: acc.cal + curr.calories,
    pro: acc.pro + curr.protein,
    car: acc.car + curr.carbs,
    fat: acc.fat + curr.fats
  }), { cal: 0, pro: 0, car: 0, fat: 0 });

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">Calorie Intake Engine</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Real-time Nutritional Data Acquisition</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] uppercase tracking-[0.2em] text-xs shrink-0"
        >
          <Plus className="w-5 h-5" />
          Log Nutrient Input
        </button>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Energy Cap', value: totals.cal, unit: 'KCAL', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Protocols', value: totals.pro, unit: 'G', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Kinetics', value: totals.car, unit: 'G', icon: Apple, color: 'text-lime-400', bg: 'bg-lime-500/10' },
          { label: 'Hormonal', value: totals.fat, unit: 'G', icon: Utensils, color: 'text-purple-400', bg: 'bg-purple-500/10' }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-center relative overflow-hidden group transition-all hover:bg-white/[0.08]"
          >
            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} blur-[30px] -z-10 group-hover:opacity-100 opacity-50`}></div>
            <stat.icon className={`w-6 h-6 mx-auto mb-4 ${stat.color}`} />
            <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}<small className="text-[10px] ml-1 text-slate-500">{stat.unit}</small></div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Meals List */}
      <div className="bg-white/5 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-lime-400 via-emerald-500 to-blue-500 opacity-50"></div>
        <div className="px-10 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-3 uppercase">
            <Calendar className="w-5 h-5 text-lime-400" />
            Current Session Logs
          </h3>
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            {meals.length} ENTRIES RECORDED
          </span>
        </div>
        
        {loading && meals.length === 0 ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-lime-400" />
          </div>
        ) : meals.length > 0 ? (
          <div className="divide-y divide-white/5">
            {meals.map((meal) => (
              <motion.div 
                key={meal.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                className="px-10 py-8 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-lime-400 shadow-inner group-hover:scale-105 transition-transform">
                    {meal.mealType === 'breakfast' && <Coffee className="w-6 h-6" />}
                    {meal.mealType === 'lunch' && <Sun className="w-6 h-6" />}
                    {meal.mealType === 'dinner' && <Moon className="w-6 h-6" />}
                    {meal.mealType === 'snack' && <Apple className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white tracking-tight uppercase leading-none mb-2">{meal.name}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{meal.mealType} PROTOCOL</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-right hidden sm:block">
                    <div className="text-xl font-black text-lime-400 tracking-tighter mb-1">{meal.calories} KCAL</div>
                    <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest flex gap-4">
                      <span>P: {meal.protein}G</span>
                      <span>C: {meal.carbs}G</span>
                      <span>F: {meal.fats}G</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(meal.id)}
                    className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
             <Activity className="w-12 h-12 text-slate-700 mx-auto mb-6 opacity-50" />
            <p className="text-slate-500 font-medium italic">No biometric fuel logs detected for current cycle.</p>
          </div>
        )}
      </div>

      {/* Add Meal Slide-over */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-[#050505] border-l border-white/10 shadow-3xl z-[70] p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Register New Intake</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <Plus className="w-8 h-8 rotate-45 text-slate-500 hover:text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Input Descriptor</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-lime-400 outline-none text-white font-bold transition-all"
                    placeholder="e.g. Whey Isolate Protocol"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Energy Value</label>
                    <input 
                      type="number" 
                      value={formData.calories}
                      onChange={(e) => setFormData({...formData, calories: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-lime-400 outline-none text-white font-bold transition-all"
                      placeholder="500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Batch Category</label>
                    <select 
                      value={formData.mealType}
                      onChange={(e) => setFormData({...formData, mealType: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-lime-400 outline-none text-white font-bold appearance-none transition-all"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] border-b border-white/5 pb-2">Macronutrient Distribution</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 text-center text-blue-400">Protein</label>
                      <input 
                         type="number" 
                         value={formData.protein}
                         onChange={(e) => setFormData({...formData, protein: e.target.value})}
                         className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 outline-none text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 text-center text-lime-400">Carbs</label>
                      <input 
                         type="number" 
                         value={formData.carbs}
                         onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                         className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-lime-400 outline-none text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 text-center text-purple-400">Fats</label>
                      <input 
                         type="number" 
                         value={formData.fats}
                         onChange={(e) => setFormData({...formData, fats: e.target.value})}
                         className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-400 outline-none text-white text-center font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-10">
                  <button 
                    type="submit"
                    className="w-full py-5 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-[24px] transition-all shadow-[0_0_30px_rgba(163,230,53,0.3)] uppercase tracking-[0.2em] text-xs"
                  >
                    Commit Log Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
