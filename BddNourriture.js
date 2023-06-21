import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MealPlanContext } from './MealPlanContext';
import { useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';

const BddNourriture = () => {
  const isFocused = useIsFocused();  
  const { mealPlan, setMealPlan, getInitialMealPlan } = useContext(MealPlanContext);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [foodData, setFoodData] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalMealVisible, setModalMealVisible] = useState(false);
  const [modalDayVisible, setModalDayVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Lundi');
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleSearchSubmit = () => {
    // Requête à l'API
    const apiKey = 'b94da879216938c07bc512e903464e1a';
    const appId = '1bab02c0';
    const endpoint = 'https://api.edamam.com/api/food-database/v2/parser';
    const query = encodeURIComponent(searchText);

    // Construire l'URL avec les paramètres de la requête
    const url = `${endpoint}?ingr=${query}&app_id=${appId}&app_key=${apiKey}`;

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
            console.log('Nom de l\'aliment :', foundFood.label);
            console.log('Teneur en calories :', foundFood.nutrients.ENERC_KCAL);
            console.log('Autres informations nutritionnelles :', foundFood.nutrients);
            setFoodData([foundFood]);
          } else {
            console.log('Aucun aliment trouvé');
            setFoodData(null);
          }
        } else {
          console.log('Aucun aliment trouvé');
          setFoodData(null);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setSearchText('');
    setFoodData('');
    console.log("Meal Plan bdd (updated): ", mealPlan);
  }, [isFocused]);

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
      console.log("vide");
      setModalMealVisible(false);
      console.log("vide meal", selectedMeal);
      console.log("vide day", selectedDay);
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
                <Text style={styles.textAdd}> Ajouter </Text>
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
              onValueChange={(itemValue) => { setSelectedDay(itemValue); console.log('Selected day:', itemValue); }}
            >
              <Picker.Item label="Lundi" value="Lundi" />
              <Picker.Item label="Mardi" value="Mardi" />
              <Picker.Item label="Mercredi" value="Mercredi" />
              <Picker.Item label="Jeudi" value="Jeudi" />
              <Picker.Item label="Vendredi" value="Vendredi" />
              <Picker.Item label="Samedi" value="Samedi" />
              <Picker.Item label="Dimanche" value="Dimanche" />
            </Picker>
            <TouchableOpacity onPress={() => { setModalDayVisible(false); setModalMealVisible(true);  }} style={styles.btnConfirm}>
              <Text> Confirmer </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalDayVisible(false)} style={styles.btnCancel}> 
              <Text> Annuler </Text>
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
              onValueChange={(itemValue) => { setSelectedMeal(itemValue); console.log('Selected item:', itemValue); }}
            >
              <Picker.Item label="Petit-déjeuner" value="Breakfast" />
              <Picker.Item label="Déjeuner" value="Lunch" />
              <Picker.Item label="Collation" value="Snack" />
              <Picker.Item label="Dîner" value="Dinner" />
            </Picker>
            <TouchableOpacity onPress={() => { handleConfirmMeal()  }} style={styles.btnConfirm}>
              <Text> Confirmer </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalMealVisible(false)} style={styles.btnCancel}> 
              <Text> Annuler </Text>
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
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
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
    borderColor: '#ccc',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
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
    backgroundColor: '#ef233c',
    width: '70%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  btnConfirm: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 4,
    backgroundColor: '#80ed99',
    marginBottom: 5,
  },
  btnCancel: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 4,
    backgroundColor: '#ea3546',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textAdd: {
    fontSize: 16,
    lineHeight: 15,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
};

export default BddNourriture;
