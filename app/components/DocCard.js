import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import ResponsiveImageView from 'react-native-responsive-image-view';

const img = "https://via.placeholder.com/320x180";


const DocCard = props => (
  <View style={styles.container}>
    <ResponsiveImageView source={{uri: img}}
                         aspectRatio={1.77}
                         render={({getViewProps, getImageProps}) => (
                           <View {...getViewProps()}>
                             <Image {...getImageProps()} />
                           </View>
                         )}
    />
    <View>
      <Text style={styles.title}>Code de la route</Text>
    </View>
  </View>
);


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  mediaContainer: {
    flex: 1
  },
  media: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined,
    aspectRatio: 1.77,
    resizeMode: 'contain'
  },
  title: {
    margin: 16,
    color: '#000',
    fontSize: 24,
    fontWeight: '500',
  }
});


export default DocCard;