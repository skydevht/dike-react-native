import React from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import DocCard from "../components/DocCard";

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList data={[{key: 'a'}, {key: 'b'}]}
                  renderItem={() => <DocCard/>}
                  ItemSeparatorComponent={() => <View style={{height: 16}}/>}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({});