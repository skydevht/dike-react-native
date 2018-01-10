import React from 'react';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Button, FlatList, StyleSheet, TouchableNativeFeedback, View} from "react-native";
import DocCard from "../components/DocCard";

const mapStateToProps = state => ({
  docs: state.data.docs
});


const SearchButton = connect()(props => (
  <TouchableNativeFeedback
    onPress={props.onPress}
    background={TouchableNativeFeedback.SelectableBackground()}>
    <View style={{marginRight: 4, padding: 12}}>
      <Icon name="search" size={24}/>
    </View>
  </TouchableNativeFeedback>
));

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Dike',
    headerRight: <SearchButton onPress={() => navigation.navigate('Search')}/>
  });

  _viewDoc = (doc) => {
    this.props.navigation.navigate('DocDetails', {title: doc.name, id: doc.id});
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.props.docs}
                  renderItem={({item}) => (
                    <DocCard title={item.name}
                             thumb={`asset:/${item.path}/cover.jpg`}
                             onPress={() => this._viewDoc(item)}/>
                  )}
                  keyExtractor={item => item.id}
                  ItemSeparatorComponent={() => <View style={{height: 16}}/>}/>
      </View>
    );
  }
}

export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({});