import { Text, View, TextInput, Button,TouchableOpacity, Keyboard, ScrollView} from 'react-native';
import { useState , useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';


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

  return adjustedCalories.toFixed(2);;
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

  function CalorieResult({ adjustedCalories }) {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Votre apport calorique quotidien est :
        </Text>
        <Text style={styles.resultSubText}>
          {adjustedCalories} calories
        </Text>
        <TouchableOpacity onPress={handleEditForm} style={styles.btn}>
            <Text style={styles.text}> Modifier le formulaire </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={showForm ? styles.headerContainer : styles.hidden}>
        <Text style={styles.textHeader}>Calculez votre apport calorique journalier</Text>
      </View>

      <View style={showForm ? styles.form : styles.hidden}>
        <TouchableOpacity onPress={Keyboard.dismiss}>
          <View style={styles.formArea}>
            <View style={styles.formControl}>
              <Text style={styles.formText}> Age : </Text>

              <TextInput
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                onBlur={handleInputChange}
                style={styles.formInput}
              />
            </View>

            <View style={styles.formControl}>
              <Text style={styles.formText}> Genre : </Text>

              <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              onBlur={handleInputChange}
              style={styles.formPicker}
              itemStyle={styles.formPickerItem}
              >
                <Picker.Item label="Femme" value="femme" />
                <Picker.Item label="Homme" value="homme" />
              </Picker>
            </View>
            

            <View style={styles.formControl}>
              <Text style={styles.formText}> Taille : </Text>

              <TextInput
              placeholder="Hauteur"
              value={height}
              onChangeText={setHeight}
              onBlur={handleInputChange}
              keyboardType="numeric"
              style={styles.formInput}
              />
            </View>

            <View style={styles.formControl}>
              <Text style={styles.formText}> Niveau d'activité : </Text>

              <Picker
              selectedValue={activityLevel}
              onValueChange={(itemValue) => setActivityLevel(itemValue)}
              onBlur={handleInputChange}
              style={styles.formPicker}
              itemStyle={styles.formPickerItem}
              >
                <Picker.Item label="Sédentaire" value="sedentaire" />
                <Picker.Item label="Exercice léger" value="exercice_leger" />
                <Picker.Item label="Exercice modéré" value="exercice_moderé" />
                <Picker.Item label="Exercice intense" value="exercice_intense" />
                <Picker.Item label="Extra actif" value="extra_actif" />
              </Picker>
            </View>

            <View style={styles.formControl}>
              <Text style={styles.formText}> Poids : </Text>
              <TextInput
                placeholder="Poids"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                style={styles.formInput}
              />
            </View>

            <View style={styles.formControl}>
              <Text style={styles.formText}> Objectif de santé : </Text>

              <Picker
              selectedValue={healthGoal}
              onValueChange={(itemValue) => setHealthGoal(itemValue)}
              onBlur={handleInputChange}
              style={styles.formPicker}
              itemStyle={styles.formPickerItem}
              >
                <Picker.Item label="Perte de poids" value="perte_poids" />
                <Picker.Item label="Maintien du poids" value="maintien_poids" />
                <Picker.Item label="Gain de poids" value="gain_poids" />
              </Picker>
            </View>
            
            

            <TouchableOpacity onPress={handleFormSubmit} disabled={!isFormValid} style={styles.btn}>
              <Text style={styles.text}> Soumettre </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
        <View style={!showForm ? styles.result : styles.hidden}>
          <CalorieResult adjustedCalories={adjustedCalories} />
        </View>
    </ScrollView>
  );
};

const styles = {
  container : {
    flexGrow: 1
  },

  hidden: {
    display: 'none',
  },

  headerContainer : {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  textHeader: {
    flex: 1,
    paddingBottom: 20, 
    paddingTop: 10
  },

  result: {
    flex: 1,
    justifyContent: 'center'
  },

  form: {
    height: '100%',
    marginTop: 20,
    top: 0,
  },

  formArea : {
    paddingHorizontal: 20
  },

  formControl : {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  formText : {
    fontWeight: 'bold', 
    marginRight: 10
  },

  formInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    width: '70%',
    height: 23,
    padding: 5
  },

  formPicker: {
    borderWidth: 1, 
    borderColor: 'transparent', 
    marginBottom: 10,
    borderRadius: 5,
    width: '50%',
  },

  formPickerItem: {
    height: 32,
    fontSize: 12,
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

  text: {
    color: 'white',
  },

  resultContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  resultText: {
    fontSize: 18, 
    fontWeight: 'bold'
  },

  resultSubText: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 10,
    marginBottom: 10 
  }
} 
export default ObjectifsForm;

