import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Trash2, ExternalLink, Calendar, Dumbbell, Utensils, Loader2, Sparkles } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';

export default function SavedPlans() {
  const { getCollectionData, removeDocument, loading } = useFirebase();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    const data = await getCollectionData('savedPlans');
    setPlans(data || []);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this plan?')) {
      await removeDocument('savedPlans', id);
      fetchPlans();
      if (selectedPlan?.id === id) setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saved AI Plans</h1>
          <p className="text-gray-400">Access your historical AI-generated workout and meal programs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plans List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {loading && plans.length === 0 ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : plans.length > 0 ? (
            plans.map((p) => (
              <motion.div 
                key={p.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPlan(p)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                  selectedPlan?.id === p.id 
                    ? 'bg-emerald-500/10 border-emerald-500/50' 
                    : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${p.type === 'workout' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {p.type === 'workout' ? <Dumbbell className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white truncate max-w-[200px]">{p.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, p.id)}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center bg-gray-900 border border-gray-800 rounded-3xl opacity-50">
              <Bookmark className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-sm text-gray-500 font-medium">No saved plans yet. Generate some programs in the planners!</p>
            </div>
          )}
        </div>

        {/* Plan Detail Viewer */}
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <motion.div 
              key={selectedPlan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl h-full"
            >
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-800">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${selectedPlan.type === 'workout' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {selectedPlan.type === 'workout' ? <Dumbbell className="w-8 h-8" /> : <Utensils className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedPlan.title}</h2>
                    <p className="text-gray-400 text-sm">Saved from AI generation on {new Date(selectedPlan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 rounded-xl text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3 fill-emerald-400" />
                  Verified Plan
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <pre className="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-gray-300 text-xs font-mono overflow-auto max-h-[600px] whitespace-pre-wrap">
                  {JSON.stringify(selectedPlan.content, null, 2)}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] bg-gray-900/30 border border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-gray-600">
               <ExternalLink className="w-16 h-16 mb-4 opacity-20" />
               <p className="font-medium">Select a saved plan from the list to view full details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
