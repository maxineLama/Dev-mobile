import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, ScrollView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MealPlanContext } from './MealPlanContext';
import { useContext } from 'react';

const BddNourriture = () => {
  
  const { mealPlan, setMealPlan } = useContext(MealPlanContext);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [foodData, setFoodData] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  const updateMealPlan = (selectedMeal) => {
    setMealPlan((prevMealPlan) => {
      const updatedMealPlan = { ...prevMealPlan };
      const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      updatedMealPlan[currentDay][selectedMeal] = [...updatedMealPlan[currentDay][selectedMeal], selectedFood];
      return updatedMealPlan;
    });
  };

const handleAddToMeal = (food) => {
  setSelectedFood(food);
  setModalVisible(true);
  console.log(mealPlan);
};

const handleConfirmMeal = () => {
  if (selectedMeal !== '') {
    updateMealPlan(selectedMeal);
    setModalVisible(false);
  }
};

useEffect(() => {
  console.log("Meal Plan bdd (updated): ", mealPlan);
}, [mealPlan]);

return (
  <View style={styles.container}>
    <Text style={styles.heading}>Base de données sur les aliments</Text>
    <TextInput style={styles.input} placeholder="Rechercher un aliment" value={searchText} onChangeText={handleSearchChange} />
    <Button title="Rechercher" onPress={handleSearchSubmit} />

    {/* Display the food data */}
    {foodData && (
      <ScrollView style={styles.foodDataContainer}>
        {foodData.map((food) => (
          <View key={food.foodId} style={styles.foodItemContainer}>
            <Text style={styles.foodItemLabel}>Nom de l'aliment: {food.label}</Text>
            <Text style={styles.foodItemText}>Teneur en calories: {food.nutrients.ENERC_KCAL}</Text>
            <Text style={styles.foodItemText}>Autres informations nutritionnelles:</Text>
            {Object.entries(food.nutrients).map(([key, value]) => (
              <Text key={key} style={styles.foodItemText}>{key}: {value}</Text>
            ))}
            <Button title="Ajouter au planning de repas" onPress={() => handleAddToMeal(food)} />
          </View>
        ))}
      </ScrollView>
    )}

  
    <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} transparent={true} >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Sélectionner le repas :</Text>
          <Picker style={styles.picker} selectedValue={selectedMeal} onValueChange={(itemValue) => { setSelectedMeal(itemValue); console.log('Selected item:', itemValue); }} >
            <Picker.Item label="Selectionnez un repas" value="" />
            <Picker.Item label="Petit-déjeuner" value="Breakfast" />
            <Picker.Item label="Déjeuner" value="Lunch" />
            <Picker.Item label="Collation" value="Snack" />
            <Picker.Item label="Dîner" value="Dinner" />
          </Picker>
          <Button title="Confirmer" onPress={handleConfirmMeal} disabled={selectedMeal === ''} />
        </View>
      </View>
    </Modal>
  </View>
  );
};

export default BddNourriture;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  foodDataContainer: {
    marginTop: 20,
  },
  foodItemContainer: {
    marginBottom: 10,
  },
  foodItemLabel: {
    fontWeight: 'bold',
  },
  foodItemText: {
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
    marginBottom: 10,
  },
  picker: {
    marginBottom: 10,
  },
};
