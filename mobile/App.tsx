import React from 'react';
import { AppLoading } from 'expo'
import { View, StatusBar } from 'react-native'
import Routes from './src/routes';
import { useFonts } from '@use-expo/font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
    'Ubuntu-Bold': require('./assets/fonts/Ubuntu/Ubuntu-Bold.ttf'),
    'Ubuntu-Regular': require('./assets/fonts/Ubuntu/Ubuntu-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />
  }
  return (
    //Essa tag <> </> é uma fragment que é uma tag que não gera nada no resultado final
    //É necessário usar ela ou uma View pq não podemos colocar mais de um coponente no return, sem ter uma view ou esse fragment em volta 
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  );
}


