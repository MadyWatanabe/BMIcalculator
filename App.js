import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Use the following code in cmd to delay the SplashScreen: npx expo install expo-splash-screen
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const heightKey = '@MyApp:heightKey';
const BMIKey = '@MyApp:BMIKey';

export default class App extends Component {
  state = {
    height: '',
    storedHeightValue: '',
    weight:'',
    storedWeightValue: '',
    BMIcalc: '',
  };

  constructor(props) {
    super(props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const storedHeightValue = await AsyncStorage.getItem(heightKey);
      this.setState({ storedHeightValue });
    } catch (error) {
      Alert.alert('Error line 32', 'There was an error while loading the height');
    }
    try {
      const BMIcalc = await AsyncStorage.getItem(BMIKey);
      this.setState({ BMIcalc });
    } catch (error) {
      Alert.alert('Error line 38', 'There was an error while loading BMIcalc');
    }
    
  }

  onSave = async () => {
    const { storedHeightValue } = this.state;
    const { weight } = this.state;
    const { BMIcalc } = this.state;

    try {
      await AsyncStorage.setItem(heightKey, storedHeightValue);
    } catch (error) {
      Alert.alert('Error line 51', 'There was an error while saving the height');
    }
    let BMI = (weight / (storedHeightValue * storedHeightValue) * 703);
    try {
      await AsyncStorage.setItem(BMIKey, BMI.toFixed(1));
    } catch (error) {
      Alert.alert('Error line 57', 'There was an error while saving the BMI');
    }
    this.setState({ BMIcalc: BMI.toFixed(1) });
    
  }
// both the state variable and parameter have the same name
  onChangeHeight = (height) => {
    this.setState({ height });
    this.setState({ storedHeightValue: height });
  }

  onChangeWeight = ( value) => {
    this.setState({ weight: value });
    this.setState({ storedWeightValue: value });
  }

  render() {
    const { weight, storedHeightValue, BMIcalc } = this.state;
    
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
          <TextInput
            style={styles.input}
            onChangeText={this.onChangeWeight}
            value={weight}
            placeholder="Weight in Pounds"
          />
          <TextInput
            style={styles.input}
            onChangeText={this.onChangeHeight}
            value={storedHeightValue}
            placeholder="Height in Inches"
          />
          <TouchableOpacity onPress={this.onSave}>
            <Text style={styles.button}>Compute BMI</Text>
          </TouchableOpacity>
 {/* The calculation should not show up initially, but should show once a height and 
 weight have been entered, this should persist until the user enters differing
 inputs and presses the  'Compute BMI' button */}
<Text style={styles.bmi}>{BMIcalc ? 'Body Mass Index is ' + BMIcalc : '' }</Text>

          <Text style={styles.assessment}>Assessing Your BMI:</Text>
          <Text style={styles.guide}>Underweight: less than 18.5</Text>
          <Text style={styles.guide}>Healthy: 18.5 to 24.9</Text>
          <Text style={styles.guide}>Overweight: 25.0 to 29.9</Text>
          <Text style={styles.guide}>Obese: 30.0 or higher</Text>           
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    backgroundColor:'#f4511e',
    fontWeight: 'bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    paddingTop: 28,
    paddingBottom: 24,
    marginBottom: 10,
  },
  button: {
    backgroundColor:'#34495e',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
  },
  input:{
    backgroundColor:'#ecf0f1',
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginBottom: 10,
    fontSize: 24, 
  },
  assessment:{
    fontSize: 20,
    paddingLeft: 5,
  },
  guide:{
    fontSize: 20,
    paddingLeft: 25,
  },
  bmi: {
fontSize: 28,
marginBottom: 60,
textAlign: 'center',
  },
  
});
