import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BddNourriture from './BddNourriture';
import ObjectifsForm from './Objectifs';
import PlanningRepas from './PlanningRepas';
import { MealPlanProvider } from './MealPlanContext';
import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    console.log('Meal Plan APP compo principal (updated)');
  }, []);

  return (
    <MealPlanProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) =>({
            tabBarIcon: ({focused, color}) => {
                let iconName;

                if (route.name == "Objectifs") {
                    iconName = "bullseye"
                } else if (route.name == "Aliments") {
                    iconName = "database"
                } else if (route.name == "Programme") {
                    iconName = "calendar"
                }

                return <Icon name={iconName} size={24} color={color}/>

            },
            tabBarActiveTintColor: '#ef233c',
            tabBarInactiveTintColor: 'gray',
            activeTintColor: 'red',
            inactiveTintColor: 'green',
        })}
      >
          <Tab.Screen name="Objectifs" component={ObjectifsForm} />
          <Tab.Screen name="Aliments" component={BddNourriture} />
          <Tab.Screen name="Programme" component={PlanningRepas} />
        </Tab.Navigator>
      </NavigationContainer>
    </MealPlanProvider>
  );
}