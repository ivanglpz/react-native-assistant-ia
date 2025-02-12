import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export const Badge = ({ name, color }: { name: string; color: string }) => {
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
        colors={[color, color]}
        style={{
          height: 25,
          width: 25,
          borderRadius: 25,
        }}
      />
      <Text
        style={{
          fontSize: 16,
          color: "white",
        }}
      >
        {name}
      </Text>
    </View>
  );
};
