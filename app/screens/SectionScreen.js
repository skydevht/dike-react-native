import React from 'react';
import {FlatList, Text, View} from "react-native";

const ARTICLE = 72;

export default class SectionScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.section.name
  });

  constructor(props) {
    super(props);
    const section = props.navigation.state.params.section;
    this.data = [];
    this.articles = [];
    this._processSections(section);
    this.state = {items: this.data};
  }

  static _getStyle(level) {
    if (level === ARTICLE) {
      return {
        margin: 16,
        fontSize: 16,
        color: 'rgba(0, 0, 0, .89)'
      }
    } else {
      const style = {
        padding: 8,
        backgroundColor: '#fff'
      };
      switch (level) {
        case 0:
          style.fontWeight = '500';
          break;
        case 1:
          style.fontWeight = '500';
          break;
        case 2:
          break;
      }
      return style;
    }
  }

  _renderItem = ({item}) => {
    return (
      <Text style={SectionScreen._getStyle(item.level)}>
        {item.name}
      </Text>
    )
  };

  _processSections = (section, level) => {
    if (section) {
      const level = level || 0;
      let item = this._newSection(`${section.type} - ${section.name}`, section.order, level);
      this.data.push(item);
      const contents = section.contents || [];
      contents.forEach(content => {
        item = this._newSection(content.name, content.order, ARTICLE);
        this.data.push(item);
        this.articles.push(content);
      });
      const children = section.children || [];
      children.forEach(child => {
        this._processSections(child, level + 1);
      })
    }
  };

  _newSection(name, order, level) {
    return {name, order, level};
  }


  render() {
    return (
      <View>
        <FlatList data={this.state.items}
                  renderItem={this._renderItem}
                  keyExtractor={item => item.order}/>
      </View>
    );
  }

}