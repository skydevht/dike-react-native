import Api from '../data/api';

export const IMPORT_DATA = 'import-data';

function importData(data) {
  return {
    type: IMPORT_DATA,
    payload: {
      docs: data
    }
  }
}


export function loadData() {
  return function (dispatch) {
    Api.loadDocs().then(docs => dispatch(importData(docs)));
  }
}