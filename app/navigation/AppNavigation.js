import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import AudioList from "../screens/AudioList";
import PlayList from "../screens/PlayList";
import Search from "../screens/Search";
import Player from "../screens/Player";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Lagu from "../screens/Lagu";

// Bagian Awal Isi
import LaguDuaRibuan from "../IsiLagu/LaguDuaRibuan";
import AlFatihah from "../IsiLagu/AlFatihah";
import AnNas from "../IsiLagu/AnNas";
import AlIkhlas from "../IsiLagu/AlIkhlas";
import LaguIndie from "../IsiLagu/LaguIndie";
import LaguInggirs from "../IsiLagu/LaguInggirs";
import LaguLastChild from "../IsiLagu/LaguLastChild";
import LaguSheila from "../IsiLagu/LaguSheila";
import LaguVierra from "../IsiLagu/LaguVierra";
// Bagian Akhir Isi Lagu

// Bagian Awal Informasi Lagu
// import InfoLaguDuaRibuan from "../IsiLagu/informasi/InfoLaguDuaRibuan";
// import InfoAlFatihah from "../IsiLagu/informasi/InfoAlFatihah";
// import InfoAlIkhlas from "../IsiLagu/informasi/InfoAlIkhlas";
// import InfoAnNas from "../IsiLagu/informasi/InfoAnNas";
import InfoLaguDuaRibuan from "../IsiLagu/informasi/InfoLaguDuaRibuan";
import InfoAlFatihah from "../IsiLagu/informasi/InfoAlFatihah";
import InfoAnNas from "../IsiLagu/informasi/InfoAnNas";
import InfoAlIkhlas from "../IsiLagu/informasi/InfoAlIkhlas";
import InfoLaguIndie from "../IsiLagu/informasi/InfoLaguIndie";
import InfoLaguInggirs from "../IsiLagu/informasi/InfoLaguInggirs";
import InfoLaguLastChild from "../IsiLagu/informasi/InfoLaguLastChild";
import InfoLaguSheila from "../IsiLagu/informasi/InfoLaguSheila";
import InfoLaguVierra from "../IsiLagu/informasi/InfoLaguVierra";
// Bagian Akhir Informasi Lagu


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Test() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="MrSound" component={Audio} />
      {/* <Stack.Screen name="Lagu" component={Lagu} /> */}
      <Stack.Screen name="LaguDuaRibuan" component={LaguDuaRibuan} />
      <Stack.Screen name="AlFatihah" component={AlFatihah} />
      <Stack.Screen name="AlIkhlas" component={AlIkhlas} />
      <Stack.Screen name="AnNas" component={AnNas} />
      <Stack.Screen name="LaguIndie" component={LaguIndie} />
      <Stack.Screen name="LaguInggirs" component={LaguInggirs} />
      <Stack.Screen name="LaguLastChild" component={LaguLastChild} />
      <Stack.Screen name="LaguSheila" component={LaguSheila} />
      <Stack.Screen name="LaguVierra" component={LaguVierra} />

      <Stack.Screen name="InfoLaguDuaRibuan" component={InfoLaguDuaRibuan} />
      <Stack.Screen name="InfoAlFatihah" component={InfoAlFatihah} />
      <Stack.Screen name="InfoAlIkhlas" component={InfoAlIkhlas} />
      <Stack.Screen name="InfoAnNas" component={InfoAnNas} />
      <Stack.Screen name="InfoLaguIndie" component={InfoLaguIndie} />
      <Stack.Screen name="InfoLaguInggirs" component={InfoLaguInggirs} />
      <Stack.Screen name="InfoLaguLastChild" component={InfoLaguLastChild} />
      <Stack.Screen name="InfoLaguSheila" component={InfoLaguSheila} />
      <Stack.Screen name="InfoLaguVierra" component={InfoLaguVierra} />
    </Stack.Navigator>
    
    
  );
}

function Audio() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Audio"
        component={AudioList}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather name="headphones" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather name="play-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PlayList"
        component={PlayList}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="library-music" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Test;
