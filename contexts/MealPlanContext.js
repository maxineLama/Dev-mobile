import React, { createContext, useState } from 'react';
import { CONSTANTS } from '../redux/Constant';

export const MealPlanContext = createContext();

export const getInitialMealPlan = () => {
  const daysOfWeek = [CONSTANTS.LUNDI, CONSTANTS.MARDI, CONSTANTS.MERCREDI, CONSTANTS.JEUDI, CONSTANTS.VENDREDI, CONSTANTS.SAMEDI, CONSTANTS.DIMANCHE];
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