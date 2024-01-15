import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AudioListItem from "./app/components/AudioListItem";
import AudioProvider from "./app/context/AudioProvider";
import Test from "./app/navigation/AppNavigation";

export default function App() {
  return (
    <AudioProvider>
    <NavigationContainer>
      <Test />
    </NavigationContainer>
    </AudioProvider>
  );

}