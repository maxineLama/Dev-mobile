import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealPlanContext } from '../contexts/MealPlanContext';
import { CONSTANTS } from '../redux/Constant';
import { COLORS } from '../styles/color';

const PlanningRepas = () => {
  const { mealPlan, setMealPlan, getInitialMealPlan } = useContext(MealPlanContext);

  useEffect(() => {
    AsyncStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);
  
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
    };
    loadMealPlan();
  }, [setMealPlan]);

  
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

  let mealPlanIt = { ...mealPlan };
  if (Object.keys(mealPlan).length === 0) { // gerer le cas ou on ne peux pas itérer sur mealPlan car vide.
            mealPlanIt = getInitialMealPlan(); 
          }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {Object.entries(mealPlanIt).map(([day, meals]) => (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day}</Text>
            {Object.entries(meals).map(([meal, foods]) => (
              <View key={meal} style={styles.mealContainer}>
                <Text style={styles.mealTitle}>{meal}</Text>
                <View>
                  {Array.isArray(foods) && foods.map((food) => (
                    <View key={food.label} style={styles.foodContainer}>
                      <View style={styles.foodDetails}>
                        <Text  style={styles.foodLabel} >
                          ➤ {food.label} - {food.nutrients.ENERC_KCAL} kcal
                        </Text>
                        <SupprimerPlat dayOfWeek={day} mealName={meal} food={food} handleDeleteFood={handleDeleteFood} />
                      </View>
                    </View>
                  ))}
                </View>
                <Text style={styles.totalCaloriesText}>Total calories : <Text style={styles.boldText}>{calculateTotalCalories(foods)}</Text> kcal</Text>
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
                <Pressable style={styles.btnCancel} onPress={closeModal}>
                  <Text style={styles.text}>{CONSTANTS.NON}</Text>
                </Pressable>
                <Pressable style={styles.btnConfirm} onPress={() => { handleDeleteFood(dayOfWeek, mealName, food); closeModal(); }}>
                  <Text style={styles.text}>{CONSTANTS.OUI}</Text>
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
    backgroundColor: COLORS.WHITE,
  },
  dayContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 10,
    marginBottom: 20,
    borderRadius: 3, 
    shadowColor: COLORS.BLACK2,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dayTitle: {
    marginBottom: 20,
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.GRAY
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
    alignSelf: 'center',
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
    backgroundColor: COLORS.BLACK,
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnCancel: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    width: 50,
    borderRadius: 4,
    backgroundColor: COLORS.DARK_RED,
  },
  btnConfirm: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    borderRadius: 4,
    backgroundColor: COLORS.LIGHT_GREEN,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: COLORS.WHITE,
  },
  boldText: {
    fontWeight: 'bold',
  },
};
