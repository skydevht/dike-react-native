import React from 'react';
import {connect} from 'react-redux';
import {FlatList, StyleSheet, View} from "react-native";
import DocCard from "../components/DocCard";
import Api from '../data/api';

const data = [
  {key: 'a'},
  {key: 'b'},
  {key: 'c'},
  {key: 'd'},
  {key: 'e'}
];

const mapStateToProps = state => ({
  docs: state.docs
});

const DocsList = connect(mapStateToProps)(props => (
  <View style={styles.container}>
    <FlatList data={props.docs}
              renderItem={({item}) => (
                <DocCard title={item.name}
                         thumb={`asset:/${item.path}/cover.jpg`}
                         onPress={() => this._viewDoc(item)}/>
              )}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={{height: 16}}/>}/>
  </View>
));

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {docs: []};
  }

  _viewDoc = (doc) => {
    this.props.navigation.navigate('DocDetails', {doc});
  };


  componentDidMount() {
  }


  render() {
    return (
      <DocsList/>
    );
  }
}

const styles = StyleSheet.create({});