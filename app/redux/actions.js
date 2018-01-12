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

function flattenSection(section, doc) {
  const contents = section.contents || [];
  let articles = contents.map(content => {
    if (content.path.startsWith('text/'))
      content.path = `${doc.path}/${content.path}`;
    return Api.loadArticle(content.path).then(text =>
      Promise.resolve({
        id: `${doc.name}-${section.name}-${content.name}`,
        doc: doc.name,
        name: content.name,
        text
      }))
  });
  const children = section.children || [];
  children.forEach(child => {
    articles = articles.concat(flattenSection(child, doc));
  });
  return articles;
}

export function loadData() {
  return function (dispatch) {
    // Load all documents info from the file system
    Api.loadDocs()
      .then(docs =>
        // For each doc, load the table of contents, then add it to the doc data
        Promise.all(docs.map(doc =>
          Api.loadTOC(doc.path).then(toc =>
            new Promise.resolve((({...doc, sections: toc})))
          )
        ))
      ).then(docs => {
        // create the search index
        const idx = elasticlunr(function () {
          this.addField('text');
          this.setRef('id');
        });
        // For each doc, load all articles and add them to the index
        docs.forEach(doc => {
          const docName = doc.name;
          // Extract all articles and load them from the file system
          doc.sections.forEach(section => {
            Promise.all(flattenSection(section, doc)).then(articles => {
              articles.forEach(art => idx.addDoc(art));
            })
          });
        });
        // execute the action that send the data and the index to the store
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