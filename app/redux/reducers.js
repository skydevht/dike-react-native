import {IMPORT_DATA, VIEW_DOC} from './actions';
import {combineReducers} from 'redux';
import {NavigationActions} from 'react-navigation';

import {AppNavigator} from '../navigators/AppNavigator';

// DATA

const initialState =
  AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Home'));

function nav(state = initialState, action) {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
}

function data(state = initialState, action) {
  switch (action.type) {
    case IMPORT_DATA:
      return Object.assign({}, state, {
        docs: action.payload.docs,
        index: action.payload.index
      });
    // case VIEW_DOC:
    //   const id = action.payload.id;
    //   const {name} = state.docs.find(doc => doc.id = id);
    //   NavigationActions.navigate('DocDetails', {name});
    //   return Object.assign({}, state, {currentDocId: id});
    default:
      return state;
  }
}

export default dike = combineReducers({nav, data});// Navigation
