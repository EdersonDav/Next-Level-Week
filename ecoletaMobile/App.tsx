import React from 'react';
import { View, StatusBar } from 'react-native'
import Home from './src/pages/Home';


export default function App() {
  return (
    //Essa tag <> </> é uma fragment que é uma tag que não gera nada no resultado final
    //É necessário usar ela ou uma View pq não podemos colocar mais de um coponente no return, sem ter uma view ou esse fragment em volta 
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Home />
    </>
  );
}


