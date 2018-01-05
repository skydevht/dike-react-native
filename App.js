import React from 'react';
import {StyleSheet, Text, View, ToolbarAndroid} from 'react-native';
import DocCard from "./app/components/DocCard";
import {StackNavigator} from 'react-navigation';
import HomeScreen from "./app/screens/HomeScreen";
import DocScreen from "./app/screens/DocScreen";
import SectionScreen from "./app/screens/SectionScreen";
import ArticleScreen from "./app/screens/ArticleScreen";

const App = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Dike'
    }
  },
  DocDetails: {
    screen: DocScreen
  },
  SectionDetails: {
    screen: SectionScreen
  },
  Article : {
    screen : ArticleScreen
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
