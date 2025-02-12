import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const Assistant = ({ name }: { name: string }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1, // Repetición infinita
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
        gap: 25,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 32,
          color: "white",
        }}
      >
        {name}
      </Text>
      <Animated.View style={[animatedStyle]}>
        <LinearGradient
          colors={["#00c6ff", "#0072ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 120,
            width: 120,
            borderRadius: 120,
          }}
        />
      </Animated.View>
    </View>
  );
};
