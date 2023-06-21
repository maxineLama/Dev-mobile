import React, { createContext, useState } from 'react';

export const MealPlanContext = createContext();

export const getInitialMealPlan = () => {
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const initialMealPlan = {};
  for (let day of daysOfWeek) {
    initialMealPlan[day] = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: [],
    };
  }
  return initialMealPlan;
};

export const MealPlanProvider = ({ children }) => {
  const [mealPlan, setMealPlan] = useState(getInitialMealPlan());
  
  return (
    <MealPlanContext.Provider value={{ mealPlan, setMealPlan }}>
      {children}
    </MealPlanContext.Provider>
  );
};