import Api from '../data/api';
// import elasticlunr from 'elasticlunr';
import Fuse from 'fuse.js'

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
        const options = {
          shouldSort: true,
          tokenize: true,
          matchAllTokens: true,
          includeScore: true,
          includeMatches: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            "text",
          ]
        };
        Promise.all(docs.map(doc =>
          Promise.all(doc.sections.map(section =>
            Promise.all(flattenSection(section, doc))
          )).then(sections => new Promise.resolve(sections.reduce((acc, section) => acc.concat(section))))
        )).then(docs => new Promise.resolve(docs.reduce((acc, doc) => acc.concat(doc))))
          .then(articles => {
          const idx = new Fuse(articles, options);
          // execute the action that send the data and the index to the store
          dispatch(importData(docs, idx));
        })
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