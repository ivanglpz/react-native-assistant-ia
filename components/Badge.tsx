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
        colors={[color, "transparent"]}
        style={{
          height: 25,
          width: 25,
          borderRadius: 25,
        }}
      />
      <Text
        style={{
          fontSize: 16,
        }}
      >
        {name}
      </Text>
    </View>
  );
};
