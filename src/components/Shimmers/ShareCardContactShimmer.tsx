import { FlatList, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const contactList = [1, 2, 3, 4, 5, 6];

const ShareCardContactShimmer = () => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={{ marginTop: 20 }}
      data={contactList}
      renderItem={() => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            marginTop: 7,
            marginBottom: 7,
            marginLeft: 25,
          }}
        >
          <ShimmerPlaceholder
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
            }}
            LinearGradient={LinearGradient}
          ></ShimmerPlaceholder>
          <ShimmerPlaceholder
            style={{ width: 250, height: 20 }}
            LinearGradient={LinearGradient}
          ></ShimmerPlaceholder>
        </View>
      )}
      keyExtractor={(item) => item.toString()}
    />
  );
};

export default ShareCardContactShimmer;
