import { Text, View, TextInput, Button,TouchableOpacity, Keyboard, ScrollView} from 'react-native';
import { useState , useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';


function CalorieResult({ adjustedCalories }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Votre apport calorique quotidien est de :
      </Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>
        {adjustedCalories} calories
      </Text>
    </View>
  );
}

function calculateBMR(age, gender, weight, height) {
  let bmr = 0;

  if (gender === 'homme') {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else if (gender === 'femme') {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }

  return bmr;
}
function calculateTotalCalories(bmr, activityLevel) {
  let totalCalories = 0;

  switch (activityLevel) {
    case 'sedentaire':
      totalCalories = bmr * 1.2;
      break;
    case 'exercice_leger':
      totalCalories = bmr * 1.375;
      break;
    case 'exercice_moderé':
      totalCalories = bmr * 1.55;
      break;
    case 'exercice_intense':
      totalCalories = bmr * 1.725;
      break;
    case 'extra_actif':
      totalCalories = bmr * 1.9;
      break;
    default:
      break;
  }

  return totalCalories;
}

function adjustTotalCalories(totalCalories, healthGoal) {
  let adjustedCalories = totalCalories;

  switch (healthGoal) {
    case 'perte_poids':
      adjustedCalories -= 500;
      break;
    case 'gain_poids':
      adjustedCalories += 500;
      break;
    default:
      break;
  }

  return adjustedCalories;
}
// Premier onglet : Objectifs de santé
const ObjectifsForm =()=>{
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [healthGoal, setHealthGoal] = useState('');
  const [isFormValid, setFormValid] = useState(false);
  const [adjustedCalories, setAdjustedCalories] = useState(null);
  const [showForm, setShowForm] = useState(true);
  useEffect(() => {
  handleInputChange(); // Vérifier la validité du formulaire 
});

  const handleFormSubmit = () => {
    // Traitement des données du form
    if (
      age !== '' &&
      gender !== '' &&
      height !== '' &&
      weight !== '' &&
      activityLevel !== '' &&
      healthGoal !== ''
    ) {
      // Calculate the BMR, total calories, and adjusted calories
      const bmr = calculateBMR(age, gender, weight, height);
      const totalCalories = calculateTotalCalories(bmr, activityLevel);
      const adjustedCalories = adjustTotalCalories(totalCalories, healthGoal);

      // Update the adjustedCalories state
      setAdjustedCalories(adjustedCalories);
    } else {
      // If any form field is missing, reset the adjustedCalories state to null
      setAdjustedCalories(null);
    }
    setShowForm(false);
  };
  const handleEditForm = () => {
    setShowForm(true); // Afficher à nouveau le formulaire lors de l'édition
  };
  const handleInputChange = () => {
    // Vérification de la validité du formulaire
    
    if (
      age !== '' &&
      gender !== '' &&
      height !== '' &&
      weight !== '' &&
      activityLevel !== '' &&
      healthGoal !== ''
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ flex: 1, paddingBottom: 20, paddingTop: 10 }}>Calculez votre apport calorique journalier</Text>
      </View>
      {showForm && (
        <TouchableOpacity onPress={Keyboard.dismiss}>
          <View style={{ paddingHorizontal: 20 }}>
            <Text> Age </Text>
            <TextInput
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              onBlur={handleInputChange}
              style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, padding: 5 }}
            />

            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              onBlur={handleInputChange}
              style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10 }}
            >
              <Picker.Item label="Genre" value="" />
              <Picker.Item label="Femme" value="femme" />
              <Picker.Item label="Homme" value="homme" />
            </Picker>
            <Text> Taille </Text>
            <TextInput
              placeholder="Hauteur"
              value={height}
              onChangeText={setHeight}
              onBlur={handleInputChange}
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, padding: 5 }}
            />
            <Text> Poids </Text>
            <TextInput
              placeholder="Poids"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, padding: 5 }}
            />

            <Picker
              selectedValue={activityLevel}
              onValueChange={(itemValue) => setActivityLevel(itemValue)}
              onBlur={handleInputChange}
              style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10 }}
            >
              <Picker.Item label="Niveau d'activité" value="" />
              <Picker.Item label="Sédentaire" value="sedentaire" />
              <Picker.Item label="Exercice léger" value="exercice_leger" />
              <Picker.Item label="Exercice modéré" value="exercice_moderé" />
              <Picker.Item label="Exercice intense" value="exercice_intense" />
              <Picker.Item label="Extra actif" value="extra_actif" />
            </Picker>

            <Picker
              selectedValue={healthGoal}
              onValueChange={(itemValue) => setHealthGoal(itemValue)}
              onBlur={handleInputChange}
              style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10 }}
            >
              <Picker.Item label="Objectif de santé" value="" />
              <Picker.Item label="Perte de poids" value="perte_poids" />
              <Picker.Item label="Maintien du poids" value="maintien_poids" />
              <Picker.Item label="Gain de poids" value="gain_poids" />
            </Picker>

            <Button title="Soumettre" onPress={handleFormSubmit} disabled={!isFormValid} />
          </View>
        </TouchableOpacity>
      )}
      {!showForm && (
        <View style={{ paddingHorizontal: 20 }}>
          <CalorieResult adjustedCalories={adjustedCalories} />
          <Button title="Modifier le formulaire" onPress={handleEditForm} />
        </View>
      )}
    </ScrollView>
  );
};
export default ObjectifsForm;

