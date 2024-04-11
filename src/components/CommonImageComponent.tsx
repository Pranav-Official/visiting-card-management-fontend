import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../utils/colorPallete';
import ImageView from 'react-native-image-viewing';

type ImgContainer = {
  Image: string;
  onPress: () => void;
  indexSetter: () => void;
};

//const screenWidth = Dimensions.get('window').width;

const CommonImage = (props: ImgContainer) => {
  return (
    <View style={styles.Contentcontainer} testID="Image">
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          props.onPress();
          props.indexSetter();
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: props.Image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

type imageURI = {
  frontImageUri?: string;
  backImageUri?: string;
};

const CommonImageComponent = ({ frontImageUri, backImageUri }: imageURI) => {
  const imageData = [];

  if (frontImageUri) {
    imageData.push({ uri: frontImageUri });
  }
  if (backImageUri) {
    imageData.push({ uri: backImageUri });
  }

  const [isImageVisible, setIsImageVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // const itemSeparator = () => <View style={styles.separator} />;
  if (!frontImageUri && !backImageUri) {
    return (
      <TouchableOpacity>
        <View style={styles.mainStyle} testID="defaultImage">
          <Image
            source={require('../assets/images/Defaultcard.png')}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={styles.mainStyle}>
        <FlatList
          data={imageData}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <CommonImage
              Image={item.uri}
              indexSetter={() => setImageIndex(index)}
              onPress={() => setIsImageVisible(true)}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          // ItemSeparatorComponent={itemSeparator}
          contentContainerStyle={
            imageData.length === 1 ? styles.Contentcontainer2 : null
          }
        />
        <View testID="imageView">
          <ImageView
            images={imageData}
            imageIndex={imageIndex}
            keyExtractor={(_, index) => index.toString()}
            visible={isImageVisible}
            onRequestClose={() => setIsImageVisible(false)}
          />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Contentcontainer: {
    paddingHorizontal: 10,
  },
  mainStyle: {
    backgroundColor: colors['secondary-light'],
    paddingTop: 20,
    // flex: 1,
  },
  Contentcontainer2: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors['secondary-light'],
    borderRadius: 20,
    height: 200,
    shadowColor: colors['primary-text'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.38,
    shadowRadius: 4.84,
  },
  cardContainer: {
    alignSelf: 'center',
    backgroundColor: colors['accent-white'],
    borderRadius: 20,
    height: 200,
    width: 320,
    shadowColor: colors['primary-text'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.38,
    shadowRadius: 4.84,
    elevation: 5,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  singleImage: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors['accent-white'],
    borderRadius: 20,
    height: 200,
    width: '80%',
    shadowColor: colors['primary-text'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.38,
    shadowRadius: 4.84,
  },
});

export default CommonImageComponent;
