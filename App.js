import React from 'react';
import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import dike from './app/redux/reducers';
import {loadData} from './app/redux/actions';
import {StackNavigator} from 'react-navigation';
import HomeScreen from "./app/screens/HomeScreen";
import DocScreen from "./app/screens/DocScreen";
import SectionScreen from "./app/screens/SectionScreen";
import ArticleScreen from "./app/screens/ArticleScreen";

const store = createStore(
  dike,
  applyMiddleware(
    thunkMiddleware
  )
);

const MyNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Dike'
    }
  },
  DocDetails: {
    screen: DocScreen
  },
  SectionDetails: {
    screen: SectionScreen
  },
  Article: {
    screen: ArticleScreen
  }
});

class BasicApp extends React.Component {
  componentDidMount() {
    this.props.dispatch(loadData());
  }

  render() {
    return (<MyNavigator/>);
  }
}

const App = connect()(BasicApp);

export default (props) => (<Provider store={store}><App/></Provider>);


