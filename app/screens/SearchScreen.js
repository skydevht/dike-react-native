import React from 'react';
import {StyleSheet, TextInput, TouchableNativeFeedback, View} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';

const SearchHeader = props => (
  <View style={styles.headerWrapper}>
    <TouchableNativeFeedback onPress={() => props.navigation.goBack()}>
      <View style={ styles.backArrow}>
        <Icon name="arrow-back" size={24} color="#000"/>
      </View>
    </TouchableNativeFeedback>
    <TextInput style={styles.headerInput} underlineColorAndroid="transparent" returnKeyType="search"/>
  </View>
);

SearchHeader.displayName = 'SearchHeader';

const SearchScreen = props => (
  <View />
);

SearchScreen.navigationOptions = {
  header: props => <SearchHeader {...props} />
};

export default connect(state => ({index : state.index}))(SearchScreen);

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#fff',
    elevation: 4,
    alignItems: 'center'
  },
  backArrow: {
    marginLeft: 4,
    padding: 12,
    marginRight: 10
  },
  headerInput : {
    borderBottomWidth: 0,
    flex: 1
  }
});