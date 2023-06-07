import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BddNourriture from './BddNourriture';
import ObjectifsForm from './Objectifs';
import PlanningRepas from './PlanningRepas';
import { MealPlanProvider } from './MealPlanContext';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    console.log('Meal Plan APP compo principal (updated)');
  }, []);

  return (
    <MealPlanProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Base de données sur les aliments" component={BddNourriture} />
          <Tab.Screen name="Planification des repas" component={PlanningRepas} />
          <Tab.Screen name="Objectifs de santé" component={ObjectifsForm} />
        </Tab.Navigator>
      </NavigationContainer>
    </MealPlanProvider>
  );
}