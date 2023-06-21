import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MealPlanContext } from '../contexts/MealPlanContext';
import { useContext } from 'react';
import { CONSTANTS } from '../redux/Constant';
import { COLORS } from '../styles/color';

const BddNourriture = () => {
  const { mealPlan, setMealPlan, getInitialMealPlan } = useContext(MealPlanContext);
  const [searchText, setSearchText] = useState('');
  const [foodData, setFoodData] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalMealVisible, setModalMealVisible] = useState(false);
  const [modalDayVisible, setModalDayVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(CONSTANTS.LUNDI);

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleSearchSubmit = () => {
    // Requête à l'API
    const query = encodeURIComponent(searchText);

    // Construire l'URL avec les paramètres de la requête
    const url = `${CONSTANTS.API_URL}?ingr=${query}&app_id=${CONSTANTS.API_ID}&app_key=${CONSTANTS.API_KEY}`;

    // Effectuer la requête GET à l'API
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data?.hints?.length > 0) {
          // Parcourir la section "hints" pour trouver l'aliment correspondant
          let foundFood = null;
          for (const hint of data.hints) {
            if (hint.food.label.toLowerCase() === searchText.toLowerCase()) {
              foundFood = hint.food;
              break;
            }
          }

          if (foundFood) {
            setFoodData([foundFood]);
          } else {
            setFoodData(null);
          }
        } else {
          setFoodData(null);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log("Meal Plan bdd (updated): ", mealPlan);
  }, [mealPlan]);

  const updateMealPlan = (selectedMeal,selectedDay) => {
  setMealPlan((prevMealPlan) => {
    let updatedMealPlan = { ...prevMealPlan };
    if (Object.keys(prevMealPlan).length === 0) { // gerer le cas ou on ne peux pas itérer sur mealPlan car vide. 
      updatedMealPlan = getInitialMealPlan(); 
    }
    updatedMealPlan[selectedDay][selectedMeal].push(selectedFood);

    return updatedMealPlan;
  });
};

  const handleAddToMeal = (food) => {
    setSelectedFood(food);
    setModalDayVisible(true);
    console.log(mealPlan);
  };

  const handleConfirmMeal = () => {
    if (selectedMeal !== '' && selectedDay !=='') {
      updateMealPlan(selectedMeal,selectedDay);
      setModalMealVisible(false);
    }else{
      setModalMealVisible(false);
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Base de données</Text>
      <TextInput style={styles.input} placeholder="Rechercher un aliment" value={searchText} onChangeText={handleSearchChange} />
      <TouchableOpacity onPress={handleSearchSubmit} style={styles.btn} >
        <Text style={styles.text}>Rechercher</Text>
      </TouchableOpacity>

      {/* Display the food data */}
      {foodData && (
        <View style={styles.foodDataContainer}>
          {foodData.map((food) => (
            <View key={food.foodId} >
              <View style={styles.foodItemContainer}>
                <Text style={styles.foodItemLabel}>{food.label}</Text>
                <Text style={styles.foodItemText}><Text style={styles.foodItemSubLabel}>Teneur en calories : </Text> {food.nutrients.ENERC_KCAL}</Text>
                <Text style={styles.foodItemText}><Text style={styles.foodItemSubLabel}>Autres informations : </Text></Text>
                {Object.entries(food.nutrients).map(([key, value]) => (
                  <Text key={key} style={styles.foodItemText}>{key}: {value}</Text>
                ))}
              </View>
              <TouchableOpacity onPress={() => handleAddToMeal(food)} style={styles.btn}>
                <Text style={styles.textAdd}> {CONSTANTS.AJOUTER} </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Modal visible={modalDayVisible} onRequestClose={() => setModalDayVisible(false)} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Sélectionner un jour :</Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedDay}
              onValueChange={(itemValue) => { setSelectedDay(itemValue); }}
            >
              <Picker.Item label={CONSTANTS.LUNDI} value={CONSTANTS.LUNDI} />
              <Picker.Item label={CONSTANTS.MARDI} value={CONSTANTS.MARDI}  />
              <Picker.Item label={CONSTANTS.MERCREDI}  value={CONSTANTS.MERCREDI} />
              <Picker.Item label={CONSTANTS.JEUDI} value={CONSTANTS.JEUDI} />
              <Picker.Item label={CONSTANTS.VENDREDI} value={CONSTANTS.VENDREDI} />
              <Picker.Item label={CONSTANTS.SAMEDI} value={CONSTANTS.SAMEDI} />
              <Picker.Item label={CONSTANTS.DIMANCHE} value={CONSTANTS.DIMANCHE} />
            </Picker>
            <TouchableOpacity onPress={() => { setModalDayVisible(false); setModalMealVisible(true);  }} style={styles.btnConfirm}>
              <Text> {CONSTANTS.CONFIRM} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalDayVisible(false)} style={styles.btnCancel}> 
              <Text> {CONSTANTS.CANCEL} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalMealVisible} onRequestClose={() => setModalMealVisible(false)} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Sélectionner le repas :</Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedMeal}
              onValueChange={(itemValue) => { setSelectedMeal(itemValue); }}
            >
              <Picker.Item label={CONSTANTS.BREAKFAST_LABEL} value={CONSTANTS.BREAKFAST_VALUE} />
              <Picker.Item label={CONSTANTS.LUNCH_LABEL} value={CONSTANTS.LUNCH_VALUE}  />
              <Picker.Item label={CONSTANTS.SNACK_LABEL} value={CONSTANTS.SNACK_VALUE}  />
              <Picker.Item label={CONSTANTS.DINER_LABEL} value={CONSTANTS.DINER_VALUE} />
            </Picker>
            <TouchableOpacity onPress={() => { handleConfirmMeal()  }} style={styles.btnConfirm}>
              <Text> {CONSTANTS.CONFIRM} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalMealVisible(false)} style={styles.btnCancel}> 
              <Text> {CONSTANTS.CANCEL} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.WHITE,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  foodDataContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  foodItemContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 4
  },
  foodItemLabel: {
    paddingTop: 10,
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 25,
  },
  foodItemSubLabel : {
    
    fontWeight: 'bold',
  },
  foodItemText: {
    paddingLeft: 10,
    marginBottom: 5,
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
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    marginBottom: 20,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: COLORS.MAIN,
    width: '70%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  btnConfirm: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 4,
    backgroundColor: COLORS.LIGHT_GREEN,
    marginBottom: 5,
  },
  btnCancel: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 4,
    backgroundColor: COLORS.DARK_RED,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: COLORS.WHITE,
  },
  textAdd: {
    fontSize: 16,
    lineHeight: 15,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: COLORS.WHITE,
  },
};

export default BddNourriture;
