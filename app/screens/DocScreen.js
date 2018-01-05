import React from 'react';
import {FlatList, Image, Text, StyleSheet, View, TouchableWithoutFeedback} from "react-native";
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

  _viewSection = (section) => {
    const navigation = this.props.navigation;
    const {path} = navigation.state.params.doc;
    navigation.navigate('SectionDetails', {section, path});
  };

  _renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={() => this._viewSection(item)}>
      <View style={styles.cell}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
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
      <View style={styles.container}>
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
  container: {
    backgroundColor: '#fff'
  },
  cell: {
    padding: 16,
    backgroundColor: '#fff'
  },
  type: {
    fontSize: 14,
    color: '#145c9e'
  },
  name: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, .89)'
  }
});