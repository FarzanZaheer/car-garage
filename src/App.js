/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import garageData from './scripts/getData';

const initialLoadingStatus = new Array(garageData.length).fill(true);

const App = () => {
  const [loading, setLoadingState] = useState(initialLoadingStatus);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    console.log('use', loading);
    AsyncStorage.getItem('likedVehicles')
      .then(response => JSON.parse(response))
      .then(json => {
        if (!json) {
          setLikes(likes);
        } else {
          setLikes(json);
        }
      });
  }, []);

  const getLikes = () => {
    AsyncStorage.getItem('likedVehicles')
      .then(response => JSON.parse(response))
      .then(json => {
        setLikes(json);
      });
  };

  const saveLikes = newLikes => {
    AsyncStorage.setItem('likedVehicles', JSON.stringify(newLikes));
  };

  const moveToTop = (index, item) => {
    if (likes.includes(item.model)) {
      const removeItem = garageData.splice(index, 1)[0];
      garageData.unshift(removeItem);
    }
  };

  const likeVehicle = (index, item) => {
    if (!likes.includes(item.model)) {
      likes.push(item.model);
      setLikes(likes);
      saveLikes(likes);
      getLikes();
      moveToTop(index, item);
    } else {
      const unlike = likes.filter(value => value !== item.model);
      saveLikes(unlike);
      getLikes();
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Garage</Text>
        <FlatList
          data={garageData}
          renderItem={({item, index}) => (
            <View elevation={5} style={styles.flatlistContainer}>
              <Image
                style={styles.image}
                source={{uri: item.url}}
                onLoadEnd={() => {
                  if (loading[index] === true) {
                    const currentLoadingStatus = [...loading];
                    currentLoadingStatus[index] = false;
                    setLoadingState(currentLoadingStatus);
                  }
                }}
              />
              {loading[index] && (
                <ActivityIndicator size="large" color="#000000" />
              )}
              <View style={styles.vehicleDataContainer}>
                <View style={styles.vehicleData}>
                  <Text style={styles.vehicleModel}>{item.model}</Text>
                  <TouchableHighlight
                    style={styles.starContainer}
                    underlayColor={'transparent'}
                    onPress={() => likeVehicle(index, item)}>
                    <Image
                      style={styles.starImage}
                      source={
                        likes.includes(item.model)
                          ? require('../src/assets/star-filled.png')
                          : require('../src/assets/star-empty.png')
                      }
                    />
                  </TouchableHighlight>
                </View>
                <Text style={styles.vehicleYear}>{item.year}</Text>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          progressViewOffset={0}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'lightgray',
  },
  title: {
    paddingTop: 40,
    paddingLeft: 20,
    fontSize: 30,
    fontWeight: 'bold',
  },
  flatlistContainer: {
    margin: 20,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  vehicleDataContainer: {
    padding: 20,
  },
  vehicleData: {
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  vehicleModel: {
    fontSize: 25,
  },
  starContainer: {
    position: 'absolute',
    right: 0,
    top: 15,
  },
  starImage: {
    width: 20,
    height: 20,
  },
  vehicleYear: {
    fontSize: 15,
    paddingTop: 20,
  },
});

export default App;
