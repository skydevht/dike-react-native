import React from 'react';
import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import dike from './app/redux/reducers';
import {loadData} from './app/redux/actions';
import AppWithNavigationState from './app/navigators/AppNavigator';

class App extends React.Component {
  store = createStore(
    dike,
    applyMiddleware(
      thunkMiddleware
    )
  );

  componentDidMount() {
    this.store.dispatch(loadData());
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState/>
      </Provider>)
  }
}

export default App;


