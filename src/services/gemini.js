import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateWorkoutPlan = async (userData) => {
  const prompt = `Generate a detailed weekly workout plan for a user with the following profile:
    Age: ${userData.age}
    Gender: ${userData.gender}
    Weight: ${userData.weight}kg
    Height: ${userData.height}cm
    Fitness Level: ${userData.fitnessLevel}
    Goal: ${userData.goal}
    Available Equipment: ${userData.equipment || 'Bodyweight'}
    Workout Duration: ${userData.duration || '45'} minutes per session

    Provide the response in a structured JSON format with:
    - title: name of the plan
    - description: overview
    - schedule: an object where keys are days (Monday-Sunday) and values are objects with { exercises: [{ name, sets, reps, description }], notes }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw error;
  }
};

export const generateMealPlan = async (userData) => {
  const prompt = `Generate a daily meal plan (Breakfast, Lunch, Dinner, Snack) for a user with:
    Current Weight: ${userData.weight}kg
    Goal: ${userData.goal}
    Daily Calorie Target: ${userData.dailyCalorieGoal}
    Dietary Preferences/Allergies: ${userData.preferences || 'None'}

    Provide the response in structured JSON:
    - title: name of the plan
    - meals: { breakfast, lunch, dinner, snack }
    - nutrition: { calories, protein, carbs, fats } (totals)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};

export const chatWithCoach = async (history, message) => {
  // Convert history to @google/genai format if needed
  // But let's keep it simple for now as per skill
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message, // In a real chat you'd pass history too
      config: {
          systemInstruction: "You are a professional AI Fitness Coach. Provide encouraging, science-based advice."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Coach chat error:", error);
    throw error;
  }
};

export const getAIModel = () => ai.models; // For custom calls
