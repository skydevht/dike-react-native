import React from 'react';
import {
  FlatList, SectionList, StyleSheet, Text, TextInput, TouchableNativeFeedback, TouchableWithoutFeedback,
  View
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';

function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/-,:;";
  const to = "aaaaeeeeiiiioooouuuunc______";
  let i = 0, l = from.length;
  for (; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '_') // collapse whitespace and replace by -
    .replace(/-+/g, '_')
    .replace(/_+/g, '_'); // collapse dashes

  return str;
}

function groupByDoc(articles) {
  return articles.reduce((acc, el) => {
    const prop = string_to_slug(el.doc);
    acc[prop] = acc[prop] || {};
    acc[prop].title = el.doc;
    acc[prop].data = acc[prop].data || [];
    acc[prop].data.push(el);
    return acc;
  }, {})
}

function debounce(callback, wait, context = this) {
  let timeout = null;
  let callbackArgs = null;

  const later = () => callback.apply(context, callbackArgs);

  return function () {
    callbackArgs = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
}

class SearchHeader extends React.Component {
  _clearInput = () => {
    this.searchInput.clear();
  };

  render() {
    return (
      <View style={styles.headerWrapper}>
        <TouchableNativeFeedback onPress={() => this.props.navigation.goBack()}>
          <View style={styles.backArrow}>
            <Icon name="arrow-back" size={24} color="#000"/>
          </View>
        </TouchableNativeFeedback>
        <TextInput ref={input => this.searchInput = input}
                   autoFocus={true}
                   style={styles.headerInput} onChangeText={this.props.onChangeText}
                   underlineColorAndroid="transparent"
                   returnKeyType="search"/>
        <TouchableNativeFeedback onPress={this._clearInput}>
          <View style={styles.backArrow}>
            <Icon name="close" size={16} color="#000"/>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

SearchHeader.displayName = 'SearchHeader';

class SearchScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      header: props => <SearchHeader {...props} onChangeText={params.search ? params.search : () => null}/>
    }
  };

  constructor(props) {
    super(props);
    this.state = {items: []};
    this.items = [];
  }

  _search = debounce((q) => {
    const result = this.props.index.search(q);
    this.setState({items: result});
  }, 1000, this);

  _viewArticles = (articles, current) => {
    console.log("Curent index", current);
    const {navigation} = this.props;
    navigation.navigate('Article', {articles: articles, current, preload: true})
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setParams({search: this._search});
  }

  _renderItem = ({item, index, section}) => (
    <TouchableWithoutFeedback onPress={() => this._viewArticles(section.data, index)}>
      <View style={styles.articleCell}>
        <Text style={styles.article}>{item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  _renderHeader = ({section}) => (
    <View style={styles.sectionCell}>
      <Text style={styles.section}>{section.title}</Text>
    </View>
  );

  render() {
    const {index} = this.props;
    const {documentStore} = index;
    const data = this.state.items.map(item => item.item)
    this.items = Object.values(groupByDoc(data));
    return (
      <View>
        <SectionList sections={this.items}
                     renderSectionHeader={this._renderHeader}
                     renderItem={this._renderItem}
                     keyExtractor={item => item.id}/>
      </View>
    );
  }
}

export default connect(state => ({
    index: state.data.index
  })
)(SearchScreen);

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#fff',
    elevation: 4,
    alignItems: 'center'
  },
  backArrow: {
    marginLeft: 4,
    padding: 12,
    marginRight: 10
  },
  headerInput: {
    flex: 1,
    fontSize: 16
  },
  articleCell: {
    padding: 16
  },
  article: {
    fontSize: 16
  },
  sectionCell: {
    backgroundColor: '#fff',
    padding: 8
  },
  section: {
    fontWeight: 'bold'
  }
});