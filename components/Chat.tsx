import { useAtomValue } from "jotai";
import { View } from "react-native";
import { CHAT_MESSAGES_ATOM } from "../state/chat";
import { ChatMessage } from "./ChatMessage";

export const Chat = () => {
  const messages = useAtomValue(CHAT_MESSAGES_ATOM);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 15,
        gap: 20,
      }}
    >
      {messages?.map((e) => {
        return <ChatMessage key={e?.id} {...e} />;
      })}
    </View>
  );
};
