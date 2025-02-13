import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { CHAT_MESSAGES_PROPS } from "../state/chat";
import { Badge } from "./Badge";

export const ChatMessage = ({ content, id, type }: CHAT_MESSAGES_PROPS) => {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(content);
    Alert.alert("Copied!", "The text has been copied to your clipboard.");
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Badge
        colors={
          type === "assistant" ? ["#43cea2", "#185a9d"] : ["#00c6ff", "#0072ff"]
        }
        name={type === "assistant" ? "Whil (Assistant)" : "Me"}
      />
      <Text
        style={{
          fontSize: 18,
          color: "white",
        }}
      >
        {content}
      </Text>
      <View
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            backgroundColor: "#131313",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
          onPress={copyToClipboard}
        >
          <Ionicons name="clipboard-outline" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
