import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { MealPlanContext } from './MealPlanContext';

const PlanningRepas = () => {
  const { mealPlan, setMealPlan } = useContext(MealPlanContext);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadMealPlan = async () => {
      try {
        const savedMealPlan = await AsyncStorage.getItem('mealPlan');
        if (savedMealPlan !== null) {
          setMealPlan(JSON.parse(savedMealPlan));
        }
      } catch (error) {
        console.log(error);
      }
      setLoaded(true);
    };
    loadMealPlan();
  }, [setMealPlan]);

  useEffect(() => {
    AsyncStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);
  const handleDeleteFood = (day, meal, food) => {
      setMealPlan((prevMealPlan) => {
        const updatedFoods = prevMealPlan[day][meal].filter((item) => item !== food);
        const updatedMealPlan = { ...prevMealPlan, [day]: { ...prevMealPlan[day], [meal]: updatedFoods } };
        AsyncStorage.setItem('mealPlan', JSON.stringify(updatedMealPlan));
        return updatedMealPlan;
      });
    };
  const MealItem = ({ dayOfWeek, mealName, foods }) => {
    

    const calculateTotalCalories = (foods) => {
      let totalCalories = 0;
      for (let food of foods) {
        if (food.label && food.nutrients.ENERC_KCAL && typeof food.nutrients.ENERC_KCAL === 'number') {
          totalCalories += food.nutrients.ENERC_KCAL;
        }
      }
      return totalCalories;
    };

    return (
      <View style={styles.mealItemContainer}>
        <Text style={styles.mealItemTitle}>{mealName}</Text>
        <View>
          {foods.map((food) => (
            <View key={food.label} style={styles.foodItemContainer}>
              <Text>{food.label}</Text>
              <SupprimerPlat dayOfWeek={dayOfWeek} mealName={mealName} food={food} handleDeleteFood={handleDeleteFood} />
            </View>
          ))}
        </View>
        <Text style={styles.totalCaloriesText}>Total calories: {calculateTotalCalories(foods)}</Text>
      </View>
    );
  };

  const calculateTotalCalories = (foods) => {
    let totalCalories = 0;
    for (let food of foods) {
      if (food.label && food.nutrients.ENERC_KCAL && typeof food.nutrients.ENERC_KCAL === 'number') {
        totalCalories += food.nutrients.ENERC_KCAL;
      }
    }
    return totalCalories;
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {Object.entries(mealPlan).map(([day, meals]) => (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day}</Text>
            {Object.entries(meals).map(([meal, foods]) => (
              <View key={meal} style={styles.mealContainer}>
                <Text style={styles.mealTitle}>{meal}</Text>
                <View>
                  {Array.isArray(foods) && foods.map((food) => (
                    <View key={food.label} style={styles.foodContainer}>
                      <View style={styles.foodDetails}>
                        <Text  style={styles.foodLabel} >{food.label}</Text>
                        <Text>{food.nutrients.ENERC_KCAL} kcal</Text>
                      </View>
                      <SupprimerPlat dayOfWeek={day} mealName={meal} food={food} handleDeleteFood={handleDeleteFood} />
                    </View>
                  ))}
                </View>
                <Text style={styles.totalCaloriesText}>Total calories: {calculateTotalCalories(foods)}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

  const SupprimerPlat = ({ dayOfWeek, mealName, food, handleDeleteFood }) => {
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <TouchableOpacity onPress={openModal} style={styles.supprimerButton}>
          <Text style={styles.supprimerText}>X</Text>
        </TouchableOpacity>

        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Voulez-vous supprimer ce plat ?</Text>
              <View style={styles.modalButtons}>
                <Pressable style={styles.modalButton} onPress={closeModal}>
                  <Text style={styles.modalButtonText}>Non</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={() => { handleDeleteFood(dayOfWeek, mealName, food); closeModal(); }}>
                  <Text style={styles.modalButtonText}>Oui</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
    
  };

  
export default PlanningRepas;

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  dayContainer: {
    marginBottom: 20,
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    paddingBottom: 10, 
  },
  dayTitle: {
    marginBottom: 20,
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey',
  },
  mealContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  foodDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    
  },
   foodLabel: {
    marginRight: 10, 
  },
  supprimerButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  supprimerText: {
    color: 'red',
    fontWeight: 'bold',
  },
  totalCaloriesText: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
};
