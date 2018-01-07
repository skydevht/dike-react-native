import {IMPORT_DATA} from './actions';

const initialState = {
  docs: []
};

export default function dike(state = initialState, action) {
  switch (action.type) {
    case IMPORT_DATA:
      return Object.assign({}, state, {
        docs: action.payload.docs
      });
    default:
      return state;
  }
}