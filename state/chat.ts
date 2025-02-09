import * as Crypto from "expo-crypto";
import { atom } from "jotai";

export type CHAT_MESSAGES_PROPS = {
  id: string;
  type: "assistant" | "user";
  content: string;
};
export const CHAT_MESSAGES_ATOM = atom<CHAT_MESSAGES_PROPS[]>([]);

export const SET_NEW_CHAT_ATOM = atom(
  null,
  (get, set, args: Omit<CHAT_MESSAGES_PROPS, "id">) => {
    const UUID = Crypto.randomUUID();

    set(CHAT_MESSAGES_ATOM, [
      ...get(CHAT_MESSAGES_ATOM),
      {
        id: UUID,
        content: args?.content,
        type: args?.type,
      },
    ]);
  }
);

export const RESET_CHAT_ATOM = atom(null, (get, set) =>
  set(CHAT_MESSAGES_ATOM, [])
);
