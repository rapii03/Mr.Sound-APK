import { View, Text, StyleSheet } from "react-native";
import React from "react";
import * as Constants from "expo-constants";
const Screen = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "color.APP_BG",
    paddingTop: Constants.currentHeight,
    marginTop: 20,
    marginBottom:20,
  },
});

export default Screen;
