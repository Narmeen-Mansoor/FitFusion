import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Apple, 
  Brain, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Star,
  Activity
} from 'lucide-react';

const Features = [
  {
    title: "AI Workout Planner",
    desc: "Get personalized training routines adapted to your goals and equipment.",
    icon: Dumbbell,
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    title: "AI Meal Planner",
    desc: "Nutritious meal plans tailored to your calories and dietary restrictions.",
    icon: Apple,
    color: "bg-lime-500/20 text-lime-400"
  },
  {
    title: "AI Fitness Coach",
    desc: "A 24/7 conversational partner for all your fitness and health questions.",
    icon: Brain,
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    title: "Smart Tracking",
    desc: "Track every calorie, set, and pound with intuitive beautiful charts.",
    icon: Activity,
    color: "bg-cyan-500/20 text-cyan-400"
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-lime-400/30 font-sans antialiased">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.4)]">
            <span className="font-bold text-black text-xs uppercase tracking-tighter">FF</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FitFusion <span className="text-lime-400">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Log in</Link>
          <Link to="/register" className="px-5 py-2 bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] uppercase tracking-widest">Join Flow</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-24 pb-32 max-w-7xl mx-auto text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400 mb-8 gap-2">
            <Zap className="w-3 h-3 fill-lime-400" />
            <span>AI-Powered Fitness Evolution</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent leading-[1.1] tracking-tighter">
            Elevate Your Body with <br />
            <span className="text-lime-400 animate-pulse">Intelligence.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The ultimate AI-driven fitness ecosystem. Personalization redefined through 
            generative intelligence for your unique biological architecture.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/register" className="w-full md:w-auto px-10 py-5 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-2xl text-sm flex items-center justify-center gap-3 transition-all group shadow-[0_0_30px_rgba(163,230,53,0.2)] uppercase tracking-widest">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full md:w-auto px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl text-sm transition-all uppercase tracking-widest">
              Login to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-4xl h-[500px] bg-lime-400/10 blur-[130px] rounded-full pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="px-8 py-24 bg-white/2 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Active Users", value: "50K+" },
            { label: "AI Plans Generated", value: "1.2M+" },
            { label: "Weight Lost", value: "250K lbs" },
            { label: "Satisfaction", value: "99%" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white">Advanced AI Modules</h2>
          <p className="text-slate-400 max-w-lg mx-auto font-medium">Quantify your progress. Refine your technique. Automate your nutrition.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5 transition-all group"
            >
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-32 bg-gradient-to-b from-[#050505] to-[#0a0c10]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-24 tracking-tighter">Community Proof</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { name: "John D.", text: "The AI Meal Planner is surgical. I've lost 15lbs in 2 months with zero cognitive load.", role: "Weight Loss" },
              { name: "Sarah M.", text: "The Coach chatbot actually gives useful recovery tips. It's like having a master trainer 24/7.", role: "Muscle Gain" },
              { name: "Mike R.", text: "This is the future of fitness. The data visualization alone is worth the subscription.", role: "Biohacking" }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-white/5 border border-white/10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Star className="w-16 h-16 fill-lime-400 text-lime-400" />
                 </div>
                <p className="text-slate-300 font-medium italic mb-8 relative z-10 leading-relaxed text-lg">"{t.text}"</p>
                <div className="relative z-10">
                  <div className="font-black text-white">{t.name}</div>
                  <div className="text-[10px] text-lime-400 font-black uppercase tracking-widest mt-1">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-8 py-32 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-20 tracking-tighter">Unified Access</h2>
        <div className="max-w-xl mx-auto">
          <div className="p-10 rounded-[48px] bg-gradient-to-br from-slate-800 to-slate-950 border border-lime-400/20 shadow-[0_0_50px_rgba(163,230,53,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-3xl font-black mb-3 text-white">Pro Member</h3>
            <div className="flex items-center justify-center gap-1 mb-8">
              <span className="text-xl font-bold text-slate-500 mt-2">$</span>
              <span className="text-6xl font-black text-white tracking-tighter">19</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-2">/ month</span>
            </div>
            <ul className="space-y-4 mb-12 text-left bg-white/5 p-8 rounded-3xl border border-white/5">
              {[
                "Unlimited AI Meal Projections",
                "Personalized Workout Architecture",
                "24/7 Neural Fitness Coach",
                "Advanced Biometric Analytics",
                "Multimodal Goal Analysis",
                "Full System Feature Set"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle className="w-5 h-5 text-lime-400 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="block w-full py-5 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(163,230,53,0.3)] uppercase tracking-[0.2em] text-xs">
              Initiate Protocol
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shrink-0">
                <span className="font-bold text-black text-[10px]">FF</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">FitFusion <span className="text-lime-400">AI</span></span>
            </div>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
              Advancing human performance through generative intelligence and quantification.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Ecosystem</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
              <li><Link to="/dashboard" className="hover:text-lime-400 transition-colors">Neural Hub</Link></li>
              <li><Link to="/bmi" className="hover:text-lime-400 transition-colors">Biometrics</Link></li>
              <li><Link to="/workout-planner" className="hover:text-lime-400 transition-colors">Workouts</Link></li>
              <li><Link to="/meal-planner" className="hover:text-lime-400 transition-colors">Nutrition</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Protocols</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
              <li><button className="hover:text-lime-400 transition-colors text-left uppercase">Privacy</button></li>
              <li><button className="hover:text-lime-400 transition-colors text-left uppercase">Terms</button></li>
              <li><button className="hover:text-lime-400 transition-colors text-left uppercase">Security</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          © 2026 FitFusion AI. Neural Optimization Systems.
        </div>
      </footer>
    </div>
  );
}
