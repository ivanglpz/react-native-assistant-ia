import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export const Assistant = ({ name }: { name: string }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
        gap: 12,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 32,
        }}
      >
        {name}
      </Text>
      <LinearGradient
        colors={["#3DC5F8", "transparent"]}
        style={{
          height: 160,
          width: 160,
          borderRadius: 160,
        }}
      />
    </View>
  );
};
