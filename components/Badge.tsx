import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export const Badge = ({ name, colors }: { name: string; colors: string[] }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <LinearGradient
        colors={[colors[0], colors[1]]}
        style={{
          height: 25,
          width: 25,
          borderRadius: 25,
        }}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "white",
        }}
      >
        {name}
      </Text>
    </View>
  );
};
