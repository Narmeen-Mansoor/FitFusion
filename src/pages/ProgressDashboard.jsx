import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  Award, 
  History, 
  ChevronRight,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../context/AuthContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProgressDashboard() {
  const { userProfile, setUserProfile } = useAuth();
  const { getCollectionData, addDocument, updateDocument } = useFirebase();
  const [weightHistory, setWeightHistory] = useState([]);
  const [mealLogs, setMealLogs] = useState([]);
  const [newWeight, setNewWeight] = useState('');

  useEffect(() => {
    async function fetchData() {
      const weight = await getCollectionData('weightHistory', []);
      const meals = await getCollectionData('meals', []);
      setWeightHistory(weight || []);
      setMealLogs(meals || []);
    }
    fetchData();
  }, [getCollectionData]);

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    if (!newWeight) return;
    
    const weightVal = parseFloat(newWeight);
    const date = new Date().toISOString().split('T')[0];
    
    await addDocument('weightHistory', { weight: weightVal, date });
    
    // Update user profile initial weight if needed or current weight
    await updateDocument('users', userProfile.uid, { weight: weightVal });
    setUserProfile(prev => ({ ...prev, weight: weightVal }));
    
    setNewWeight('');
    // Re-fetch
    const updated = await getCollectionData('weightHistory', []);
    setWeightHistory(updated || []);
  };

  const calorieData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Consumed',
        data: [1850, 2100, 1950, 2200, 2050, 2400, 1900], // Example data
        backgroundColor: '#10b981',
        borderRadius: 8,
      }
    ],
  };

  const weightChartData = {
    labels: weightHistory.map(w => w.date).slice(-10),
    datasets: [
      {
        label: 'Weight',
        data: weightHistory.map(w => w.weight).slice(-10),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold">Progress Analytics</h1>
        <p className="text-gray-400">Visualizing your transformation over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weight Update Bar */}
        <div className="lg:col-span-2 p-6 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Weight</p>
              <h3 className="text-2xl font-bold">{userProfile?.weight || '--'} <span className="text-sm font-normal text-gray-500">kg</span></h3>
            </div>
          </div>
          <form onSubmit={handleWeightSubmit} className="flex gap-2">
            <input 
              type="number" 
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:border-blue-500 text-sm"
              placeholder="Enter today's weight"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Log
            </button>
          </form>
        </div>

        {/* Charts Grid */}
        <div className="p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-xl">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold">Weight Evolution</h3>
             <History className="w-5 h-5 text-gray-600" />
           </div>
           <div className="h-64">
             {weightHistory.length > 0 ? (
               <Line data={weightChartData} options={{ responsive: true, maintainAspectRatio: false }} />
             ) : (
               <div className="h-full flex items-center justify-center text-gray-500 italic">No weight data logged yet</div>
             )}
           </div>
        </div>

        <div className="p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-xl">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold">Weekly Nutrition</h3>
             <ChevronRight className="w-5 h-5 text-gray-600" />
           </div>
           <div className="h-64">
             <Bar data={calorieData} options={{ responsive: true, maintainAspectRatio: false }} />
           </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Weekly Consistency", desc: "4 Streak Days", icon: Award, color: "text-orange-400", bg: "bg-orange-500/10" },
          { title: "Goal Met", desc: "4500 kcal burned this week", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "Personal Best", desc: "Logged 7 days in a row", icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
