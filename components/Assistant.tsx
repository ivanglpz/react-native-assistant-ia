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

export type StateAsistant = "INITIAL" | "WAIT" | "ANSWER";
export const Assistant = ({
  name,
  state = "INITIAL",
}: {
  name: string;
  state: StateAsistant;
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (state === "INITIAL") {
      scale.value = withTiming(1, { duration: 300 });
      return;
    }
    if (state === "ANSWER") {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1, // Repetición infinita
        true
      );
      return;
    }
    if (state === "WAIT") {
      scale.value = withTiming(0.5, { duration: 300 });
      return;
    }
  }, [state]);

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
          colors={["#43cea2", "#185a9d"]}
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
