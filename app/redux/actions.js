import Api from '../data/api';
import elasticlunr from 'elasticlunr';

export const IMPORT_DATA = 'import-data';

function importData(docs, index) {
  return {
    type: IMPORT_DATA,
    payload: {
      docs,
      index
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
      ).then(docs => {
        const idx = elasticlunr(function () {
          this.addField('title');
          this.addField('body');
          this.setRef('id');
        });
        const doc1 = {
          "id": 1,
          "title": "Oracle released its latest database Oracle 12g",
          "body": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
        };

        const doc2 = {
          "id": 2,
          "title": "Oracle released its profit report of 2015",
          "body": "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion."
        };

        idx.addDoc(doc1);
        idx.addDoc(doc2);
        dispatch(importData(docs, idx));
      }
    )
  }
}

export const VIEW_DOC = 'view-doc';
export function viewDoc(id) {
  return {
    type: VIEW_DOC,
    payload: {
      id
    }
  }
}