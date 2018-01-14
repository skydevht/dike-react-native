import React from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {MarkdownView} from 'react-native-markdown-view';
import GestureRecognizer, {swipeDirections} from '../components/GestureRecognizer'
import Api from '../data/api';


const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export default class ArticleScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {articles, current} = navigation.state.params;
    return {
      title: articles[current].name
    };
  };

  current = 0;
  loadingPromise = null;

  constructor(props) {
    super(props);
    this.state = {article: ''}
  }

  componentDidMount() {
    this._showArticle(this.props.navigation.state.params.current);
  }

  componentWillUnmount() {
    if (this.loadingPromise) this.loadingPromise.cancel();
  }

  _showArticle = current => {
    const {articles, preload} = this.props.navigation.state.params;
    if (preload)
      this.setState({article: articles[current].text});
    else {
      this.loadingPromise = makeCancelable(Api.loadArticle(articles[current].path));
      this.loadingPromise.promise.then(text => {
        this.setState({article: text});
        this.loadingPromise = null;
      });
    }
    this.current = current;
    this.props.navigation.setParams({current});
  };

  _go = d => {
    const max = this.props.navigation.state.params.articles.length;
    let cur = d + this.current;
    if (cur > max - 1)
      cur = max - 1;
    else if (cur < 0)
      cur = 0;
    this._showArticle(cur);
  };

  _goRight = () => this._go(1);

  _goLeft = () => this._go(-1);

  render() {
    const {articles, current} = this.props.navigation.state.params;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
      detectSwipeUp: false,
      detectSwipeDown: false,
      detectSwipeLeft: true,
      detectSwipeRight: true,
    };
    return (
      <GestureRecognizer
        onSwipeLeft={this._goRight}
        onSwipeRight={this._goLeft}
        config={config}
        style={styles.container}>
        <ScrollView style={styles.articleWrapper}>
          <MarkdownView style={styles.article} styles={{
            heading1: {
              marginTop: 0,
              fontWeight: '200',
              color: '#000'
            },
            paragraph: {
              color: 'rgba(0, 0, 0, .89)',
              fontSize: 18,
              marginTop: 0
            }
          }}>
            {this.state.article}
          </MarkdownView>
        </ScrollView>
        <View style={styles.bottomIndicator}>
          <Text style={styles.doc}>{articles[current].doc}</Text>
        </View>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  articleWrapper: {
    padding: 16,
    flex: 1
  },
  article: {},
  bottomIndicator: {
    backgroundColor: '#fff',
    padding: 8,
  },
  doc: {
    fontWeight: 'bold'
  }
});