import { Text, View } from "react-native";
import { CHAT_MESSAGES_PROPS } from "../state/chat";
import { Badge } from "./Badge";

export const ChatAssistant = ({ content, id, type }: CHAT_MESSAGES_PROPS) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Badge color="#3DC5F8" name="Whil" />
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
