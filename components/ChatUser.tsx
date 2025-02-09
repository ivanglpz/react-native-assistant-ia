import { Text, View } from "react-native";
import { CHAT_MESSAGES_PROPS } from "../state/chat";
import { Badge } from "./Badge";

export const ChatUser = ({ content, id, type }: CHAT_MESSAGES_PROPS) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Badge color="#413DF8" name="Me" />
      <Text
        style={{
          fontSize: 18,
        }}
      >
        {content}
      </Text>
    </View>
  );
};
