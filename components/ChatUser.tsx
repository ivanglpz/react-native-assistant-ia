import { Text, View } from "react-native";
import { CHAT_MESSAGES_PROPS } from "../state/chat";
import { Badge } from "./Badge";

export const ChatUser = ({ content, id, type }: CHAT_MESSAGES_PROPS) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Badge colors={["#00c6ff", "#0072ff"]} name="Me" />
      <Text
        style={{
          fontSize: 18,
          color: "white",
        }}
      >
        {content}
      </Text>
    </View>
  );
};
