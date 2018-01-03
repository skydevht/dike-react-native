import React from 'react';
import {FlatList, Image, Text, StyleSheet, View} from "react-native";
import ResponsiveImageView from 'react-native-responsive-image-view';
import Api from '../data/api';

const mock = [
  {
    key: 'a',
    name: 'SUR LES DISPOSITIONS PRÉLIMINAIRES'
  },
  {
    key: 'b',
    name: 'SUR LES TRIBUNAUX DE POLICE'
  },
];


export default class DocScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.doc.name
  });

  constructor(props) {
    super(props);
    this.state = {toc: []}
  }

  _renderItem = ({item}) => (
    <Text style={styles.name}>{item.name}</Text>
  );

  _renderHeader = () => {
    const path = this.props.navigation.state.params.doc.path;
    return (
      <ResponsiveImageView source={{uri: `asset:/${path}/cover.jpg`}}
                           render={({getViewProps, getImageProps}) => (
                             <View {...getViewProps()}>
                               <Image {...getImageProps()} />
                             </View>
                           )}
      />
    );
  };

  _renderSeparator = () => (
    <View style={{height: 1, backgroundColor: 'rgba(0, 0, 0, .12)', marginLeft: 16}}/>
  );

  componentDidMount() {
    const path = this.props.navigation.state.params.doc.path;
    Api.loadTOC(path).then(toc => this.setState({toc}))
  }

  render() {
    return (
      <View>
        <FlatList data={this.state.toc}
                  renderItem={this._renderItem}
                  keyExtractor={item => item.type}
                  ListHeaderComponent={this._renderHeader}
                  ItemSeparatorComponent={this._renderSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 20,
    margin: 16
  }
});