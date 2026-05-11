import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Dumbbell, 
  Utensils, 
  Droplets, 
  TrendingUp, 
  ChevronRight,
  TrendingDown,
  Calendar,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../hooks/useFirebase';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { getCollectionData } = useFirebase();
  const [weightHistory, setWeightHistory] = useState([]);
  const [meals, setMeals] = useState([]);
  const [dailyWater, setDailyWater] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const weight = await getCollectionData('weightHistory', []);
      const todayMeals = await getCollectionData('meals', []); 
      
      setWeightHistory(weight || []);
      setMeals(todayMeals || []);
    }
    fetchData();
  }, [getCollectionData]);

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const calorieGoal = userProfile?.dailyCalorieGoal || 2000;
  const calorieProgress = Math.min((totalCalories / calorieGoal) * 100, 100);

  const weightChartData = {
    labels: weightHistory.map(w => w.date).slice(-7),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightHistory.map(w => w.weight).slice(-7),
        borderColor: '#a3e635',
        backgroundColor: 'rgba(163, 230, 53, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } },
    },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Calories Card */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between min-h-[160px] group hover:bg-white/[0.07] transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Energy</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-white tracking-tighter">{totalCalories}</h3>
              <span className="text-xs text-slate-500 font-bold">kcal</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Consumed of {calorieGoal} goal</p>
          </div>
        </div>

        {/* BMI Card */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between min-h-[160px] group hover:bg-white/[0.07] transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-lime-500/20 rounded-xl text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biometrics</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-white tracking-tighter">{userProfile?.bmi?.toFixed(1) || '--'}</h3>
              <span className="text-xs text-slate-500 font-bold">BMI</span>
            </div>
            <p className="text-[10px] text-lime-400 font-bold uppercase tracking-wider mt-1">Status: {userProfile?.bmi ? 'Optimal' : 'Pending'}</p>
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between min-h-[160px] group hover:bg-white/[0.07] transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hydration</span>
          </div>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-black text-white tracking-tighter">{dailyWater}</h3>
                <span className="text-xs text-slate-500 font-bold">L</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">of 3.5L goal</p>
            </div>
            <button 
              onClick={() => setDailyWater(prev => prev + 1)}
              className="w-10 h-10 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center rounded-xl transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Workouts Card */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between min-h-[160px] group hover:bg-white/[0.07] transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-white tracking-tighter">12</h3>
              <span className="text-xs text-slate-500 font-bold">STREAK</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2 VS LAST WEEK
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weight Chart area */}
        <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[40px] p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 blur-[100px] -z-10 rounded-full"></div>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Weight Trajectory</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Historical Biometrics Analysis</p>
            </div>
            <Link to="/progress" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-[280px]">
            {weightHistory.length > 0 ? (
              <Line data={weightChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                <TrendingUp className="w-12 h-12 mb-4 stroke-1" />
                <p className="text-sm font-medium italic">Initiate tracking for kinetic data visualization</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Active Modules</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Workouts</span>
                  <span className="text-sm font-black text-lime-400 tracking-tighter">4 <span className="text-slate-600">/ 5</span></span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-400 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.5)]" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protein Intake</span>
                  <span className="text-sm font-black text-blue-400 tracking-tighter">145g <span className="text-slate-600">/ 180g</span></span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fat Oxidation</span>
                  <span className="text-sm font-black text-purple-400 tracking-tighter">12% <span className="text-slate-600">/ 10%</span></span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.5)]" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-black border border-lime-400/20 rounded-[40px] p-8 shadow-[inset_0_0_40px_rgba(163,230,53,0.05)]">
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Need a Protocol?</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">Deploy Fusion AI to architect your next training cycle based on biometric feedback.</p>
            <Link to="/workout-planner" className="w-full py-4 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-2xl text-[10px] flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(163,230,53,0.3)] group">
              Generate AI Plan
              <Zap className="w-4 h-4 fill-black group-hover:scale-125 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
