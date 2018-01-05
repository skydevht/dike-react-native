import RNFS from 'react-native-fs';

const loadDocs = () => RNFS.readFileAssets('documents.json')
  .then(data => new Promise(resolve => resolve(JSON.parse(data))));

const loadTOC = path => {
  return RNFS.readFileAssets(`${path}/toc.json`)
    .then(data => new Promise(resolve => resolve(JSON.parse(data).sections)));
};

const loadArticle = path => RNFS.readFileAssets(path);

export default {loadDocs, loadTOC, loadArticle};