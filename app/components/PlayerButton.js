import React from "react";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";
export default function PlayerButton(props) {
  const { onPress, iconType, size = 40, iconcolor } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pausecircle";
      case "PAUSE":
        return "playcircleo";
      case "NEXT":
        return "forward";
      case "PREVIOUS":
        return "banckward";
    }
  };
  return (
    <AntDesign
      {...props}
      onPress={onPress}
      size={size}
      color={iconcolor}
      name={getIconName(iconType)}
    />
  );
}
