import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Camera, Save, Shield, Bell, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../hooks/useFirebase';

export default function ProfileSettings() {
  const { userProfile, setUserProfile, currentUser } = useAuth();
  const { updateDocument } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    dailyCalorieGoal: userProfile?.dailyCalorieGoal || 2000,
    fitnessLevel: userProfile?.fitnessLevel || 'beginner',
    goal: userProfile?.goal || 'weight_loss'
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDocument('users', currentUser.uid, formData);
      setUserProfile(prev => ({ ...prev, ...formData }));
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-400">Manage your account preferences and fitness identifiers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Avatar */}
        <div className="col-span-1 space-y-6">
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-3xl text-center shadow-xl">
             <div className="relative inline-block group mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/20 bg-gray-800 flex items-center justify-center">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-700" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
             </div>
             <h3 className="text-xl font-bold">{userProfile?.displayName || 'User'}</h3>
             <p className="text-sm text-gray-500 mb-6">{userProfile?.email}</p>
             <div className="flex flex-wrap justify-center gap-2">
               <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Premium Member</span>
               <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Beta Tester</span>
             </div>
          </div>

          <div className="p-6 bg-gray-900 border border-gray-800 rounded-3xl space-y-4">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-800 rounded-xl transition-all">
               <div className="flex items-center gap-3">
                 <Shield className="w-4 h-4 text-emerald-400" />
                 <span className="text-sm text-gray-300">Security & Privacy</span>
               </div>
               <Bell className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Right Col - General Settings */}
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-xl">
              <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Personal Information
              </h4>
              <form onSubmit={handleUpdate} className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Display Name</label>
                   <input 
                      type="text" 
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-emerald-500 outline-none transition-all"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Daily Calorie Goal</label>
                      <input 
                         type="number" 
                         value={formData.dailyCalorieGoal}
                         onChange={(e) => setFormData({...formData, dailyCalorieGoal: e.target.value})}
                         className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Fitness Level</label>
                      <select 
                         value={formData.fitnessLevel}
                         onChange={(e) => setFormData({...formData, fitnessLevel: e.target.value})}
                         className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-emerald-500 outline-none appearance-none"
                      >
                         <option value="beginner">Beginner</option>
                         <option value="intermediate">Intermediate</option>
                         <option value="advanced">Advanced</option>
                      </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Main Goal</label>
                    <select 
                       value={formData.goal}
                       onChange={(e) => setFormData({...formData, goal: e.target.value})}
                       className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-emerald-500 outline-none appearance-none"
                    >
                       <option value="weight_loss">Weight Loss</option>
                       <option value="muscle_gain">Muscle Gain</option>
                       <option value="strength">Strength Training</option>
                       <option value="flexibility">Flexibility & Health</option>
                    </select>
                 </div>

                 <div className="pt-6 border-t border-gray-800">
                    <button 
                       type="submit"
                       disabled={loading}
                       className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                    >
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
