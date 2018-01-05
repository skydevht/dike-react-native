import React from 'react';
import {StyleSheet, View} from "react-native";
import {MarkdownView} from 'react-native-markdown-view';
import Api from '../data/api';

export default class ArticleScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {articles, current} = navigation.state.params;
    return {
      title: articles[current].name
    };
  };

  constructor(props) {
    super(props);
    this.state = {article: ''}
  }

  componentDidMount() {
    const {articles, current} = this.props.navigation.state.params;
    Api.loadArticle(articles[current].path).then(text => this.setState({article: text}));
  }

  render() {
    return (
      <View style={styles.container}>
        <MarkdownView styles={{
          heading1 : {
            marginTop: 0,
            fontWeight: '200',
            color: '#000'
          },
          paragraph : {
            color: 'rgba(0, 0, 0, .89)',
            fontSize: 18,
            marginTop: 0
          }
        }}>
          {this.state.article}
        </MarkdownView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  }
});