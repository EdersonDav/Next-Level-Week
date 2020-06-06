import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import * as Location from 'expo-location'

interface Item {
  id: number,
  title: string,
  item_url: string,
}
interface Points {
  id: number,
  name: string,
  image: string,
  latitude: number,
  longitude: number,

}
interface Params {
  uf: string,
  city: string
}

const Points = () => {

  const navigation = useNavigation();
  const [points, setPoints] = useState<Points[]>([]);
  const [items, setitems] = useState<Item[]>([]);
  const [selectedItem, setselectedItem] = useState<number[]>([]);
  const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);

  const routes = useRoute();
  const routesParams = routes.params as Params;

  useEffect(() => {
    api.get('items').then(response => {
      setitems(response.data)
    })
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ops...', 'Precisamos de sua permissão para continuar com a sua localização');
        return;
      }
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setinitialPosition([
        latitude,
        longitude
      ]);
    }
    loadPosition();
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city: routesParams.city,
        uf: routesParams.uf,
        items: selectedItem
      }
    }).then(response => {
      setPoints(response.data)
    })
  }, [selectedItem])

  function handleNavigateBack() {
    navigation.goBack();
  }
  function handleNavigateToDetail(id: number) {
    navigation.navigate("Detail", { point_id: id });
  }
  function handleSelectedItem(id: number) {
    //Verificando se o item já foi selecionado
    //Se o id já estiver no selectedItem o findIndex retornara a posição dele
    const alreadySelected = selectedItem.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      //Adicionando no filteredItems todos os selectedItem que forem diferentes do id 
      const filteredItems = selectedItem.filter(item => item !== id)
      //adicionando eles no setselectedItem
      setselectedItem(filteredItems)
    } else {
      // ... para pegar tudo que tem dentro da selectedItem e adicionar o id
      setselectedItem([...selectedItem, id]);
    }

  }
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name='arrow-left' size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title}>Bem Vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map(point => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude
                  }} >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={
                        { uri: point.image }} />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}

            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItem.includes(item.id) ? styles.selectedItem : {}
              ]}
              onPress={() => handleSelectedItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.item_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto-Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;