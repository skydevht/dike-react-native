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
    Api.loadDocs()
      .then(docs =>
        Promise.all(docs.map(doc =>
          Api.loadTOC(doc.path).then(toc =>
            new Promise.resolve((({...doc, sections: toc})))
          )
        ))
      ).then(docs => {
        const idx = elasticlunr(function () {
          this.addField('text');
          this.setRef('id');
        });
        docs.forEach(doc => {
          const docName = doc.name;
          doc.sections.forEach(section => {
            Promise.all(flattenSection(section, doc)).then(articles => {
              articles.forEach(art => idx.addDoc(art));
            })
          });
        });
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