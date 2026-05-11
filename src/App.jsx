import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import BMICalculator from './pages/BMICalculator';
import WorkoutPlanner from './pages/WorkoutPlanner';
import MealPlanner from './pages/MealPlanner';
import CalorieTracker from './pages/CalorieTracker';
import CoachChat from './pages/CoachChat';
import ProgressDashboard from './pages/ProgressDashboard';
import SavedPlans from './pages/SavedPlans';
import ProfileSettings from './pages/ProfileSettings';
import GoalAnalysis from './pages/GoalAnalysis';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return currentUser ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
          } />
          <Route path="/bmi" element={
            <PrivateRoute><Layout><BMICalculator /></Layout></PrivateRoute>
          } />
          <Route path="/workout-planner" element={
            <PrivateRoute><Layout><WorkoutPlanner /></Layout></PrivateRoute>
          } />
          <Route path="/meal-planner" element={
            <PrivateRoute><Layout><MealPlanner /></Layout></PrivateRoute>
          } />
          <Route path="/calorie-tracker" element={
            <PrivateRoute><Layout><CalorieTracker /></Layout></PrivateRoute>
          } />
          <Route path="/coach" element={
            <PrivateRoute><Layout><CoachChat /></Layout></PrivateRoute>
          } />
          <Route path="/progress" element={
            <PrivateRoute><Layout><ProgressDashboard /></Layout></PrivateRoute>
          } />
          <Route path="/saved-plans" element={
            <PrivateRoute><Layout><SavedPlans /></Layout></PrivateRoute>
          } />
          <Route path="/goal-analysis" element={
            <PrivateRoute><Layout><GoalAnalysis /></Layout></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><Layout><ProfileSettings /></Layout></PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
