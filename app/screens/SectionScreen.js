import React from 'react';
import {FlatList, Text, TouchableWithoutFeedback, View} from "react-native";
import {AppNavigator} from '../navigators/AppNavigator';
import {connect} from "react-redux";

const ARTICLE = 72;

class SectionScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.name
  });

  constructor(props) {
    super(props);
    const {section, path} = props;
    this.path = path;
    this.data = [];
    this.articles = [];
    this._processSections(section);
    this.state = {items: this.data};
    this.props.navigation.setParams({name: section.name});
  }

  static _getStyle(level) {
    if (level === ARTICLE) {
      return {
        margin: 16,
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

  _viewArticle = item => {
    const current = this.articles.findIndex(article => article.order === item.order);
    this.props.navigation.navigate('Article', {articles: this.articles, current})
  };

  _renderItem = ({item}) => {
    if (item.level === ARTICLE)
      return (
        <TouchableWithoutFeedback onPress={() => this._viewArticle(item)}>
          <View style={{padding: 16}}>
            <Text style={{fontSize: 16, color: 'rgba(0, 0, 0, 0.89)'}}>{item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    return (
      <Text style={SectionScreen._getStyle(item.level)}>
        {item.name}
      </Text>
    )
  };

  _processSections = (section, level = 0) => {
    if (section) {
      let item = SectionScreen._newSection(`${section.type} - ${section.name}`, section.order, level);
      this.data.push(item);
      const contents = section.contents || [];
      contents.forEach(content => {
        item = SectionScreen._newSection(content.name, content.order, ARTICLE);
        this.data.push(item);
        if (content.path.startsWith('text/'))
        content.path = `${this.path}/${content.path}`;
        this.articles.push(content);
      });
      const children = section.children || [];
      children.forEach(child => {
        this._processSections(child, level + 1);
      })
    }
  };

  static _newSection(name, order, level) {
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


function mapStateToProps(state) {
  let {params, path} = AppNavigator.router.getPathAndParamsForState(state.nav);
  if (params && path === 'SectionDetails') {
    const {doc, sectionId} = params;
    let {path, sections} = state.data.docs.find(el => el.id === doc);
    const section = sections.find(el => sectionId === `${el.type}-${el.order}`);
    return {path, section}
  }
  return {};
}

export default connect(mapStateToProps)(SectionScreen);