import React from 'react';
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

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {docs: []};
  }

  _viewDoc = (doc) => {
    this.props.navigation.navigate('DocDetails', {doc});
  };

  _renderItem = ({item}) => (
    <DocCard title={item.name}
             thumb={`asset:/${item.path}/cover.jpg`}
             onPress={() => this._viewDoc(item)}/>
  );

  componentDidMount() {
    Api.loadDocs().then(docs => {
      this.setState({docs});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.state.docs}
                  renderItem={this._renderItem}
                  keyExtractor={item => item.id}
                  ItemSeparatorComponent={() => <View style={{height: 16}}/>}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({});