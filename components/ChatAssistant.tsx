import { Text, View } from "react-native";
import { CHAT_MESSAGES_PROPS } from "../state/chat";
import { Badge } from "./Badge";

export const ChatAssistant = ({ content, id, type }: CHAT_MESSAGES_PROPS) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Badge colors={["#43cea2", "#185a9d"]} name="Whil" />
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
