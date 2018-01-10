import React from 'react';
import {FlatList, Image, Text, StyleSheet, View, TouchableWithoutFeedback} from "react-native";
import ResponsiveImageView from 'react-native-responsive-image-view';
import {AppNavigator} from '../navigators/AppNavigator';

import {connect} from "react-redux";


class DocScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title
  });

  constructor(props) {
    super(props);
    this.state = {toc: []}
  }

  _viewSection = (section) => {
    if (this.props.doc) {
      this.props.navigation.navigate('SectionDetails',
        {
          sectionId: `${section.type}-${section.order}`,
          doc: this.props.doc.id,
        });
    }
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
    if (this.props.doc) {
      const path = this.props.doc.path;
      return (
        <ResponsiveImageView source={{uri: `asset:/${path}/cover.jpg`}}
                             render={({getViewProps, getImageProps}) => (
                               <View {...getViewProps()}>
                                 <Image {...getImageProps()} />
                               </View>
                             )}
        />
      );
    }
    return null;
  };

  _renderSeparator = () => (
    <View style={{height: 1, backgroundColor: 'rgba(0, 0, 0, .12)', marginLeft: 16}}/>
  );

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.props.doc ? this.props.doc.sections : []}
                  renderItem={this._renderItem}
                  keyExtractor={item => item.type}
                  ListHeaderComponent={this._renderHeader}
                  ItemSeparatorComponent={this._renderSeparator}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const {params, path} = AppNavigator.router.getPathAndParamsForState(state.nav);
  if (params && path === 'DocDetails') {
    const {id} = params;
    const doc = state.data.docs.find(doc => doc.id === id);
    return {doc}
  }
}

export default connect(mapStateToProps)(DocScreen);

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