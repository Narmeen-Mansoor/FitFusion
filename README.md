# FitFusion AI

FitFusion AI is an advanced, AI-powered fitness and nutrition ecosystem designed to provide professional-grade health guidance to everyone.

## Features

- **AI Workout Planner**: Custom training routines based on your goals, equipment, and level.
- **AI Meal Planner**: Personalized nutrition plans with automated macronutrient calculation.
- **AI Fitness Coach**: A 24/7 conversational partner for all your fitness queries.
- **Goal Analysis**: Upload inspiration images and get a roadmap to your target physique.
- **Calorie & Macro Tracker**: Intuitive logging of meals and nutrients.
- **Progress Dashboard**: Beautiful visualizations of weight and activity trends.
- **BMI Calculator**: Instant BMI calculation with AI health insights.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication & Firestore)
- **AI**: Google Gemini API
- **Charts**: Chart.js & React-Chartjs-2

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure your environment variables in `.env`.
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

## Environment Variables

Register your API keys and configuration in your environment:
- `GEMINI_API_KEY`: Google AI SDK Key
- `VITE_FIREBASE_...`: Your Firebase app configuration

## Deployment

The app is ready for deployment on Vercel or any static hosting platform. Ensure all environment variables are set in your provider's dashboard.
