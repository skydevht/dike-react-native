import React from 'react';
import {StyleSheet, Text, View, ToolbarAndroid} from 'react-native';
import DocCard from "./app/components/DocCard";
import {StackNavigator} from 'react-navigation';
import HomeScreen from "./app/screens/HomeScreen";

const App = StackNavigator({
  home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Dike'
    }
  }
});

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  toolbar: {
    height: 56,
    backgroundColor: '#fff'
  }
});
