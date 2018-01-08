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
    Api.loadDocs()
      .then(docs =>
        Promise.all(docs.map(doc =>
          Api.loadTOC(doc.path).then(toc =>
            new Promise.resolve((({...doc, sections: toc})))
          )
        ))
      ).then(docs => dispatch(importData(docs)));
  }
}