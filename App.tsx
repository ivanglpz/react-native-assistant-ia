import * as Speech from "expo-speech";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { StatusBar } from "expo-status-bar";
import { useSetAtom } from "jotai";
import OpenAI from "openai";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { Assistant } from "./components/Assistant";
import { Chat } from "./components/Chat";
import { Valid } from "./components/Valid";
import { SET_NEW_CHAT_ATOM } from "./state/chat";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const client = new OpenAI({
  apiKey: API_KEY, // This is the default and can be omitted
});

export default function App() {
  const setNewChat = useSetAtom(SET_NEW_CHAT_ATOM);
  const [transcript, setTranscript] = useState("");
  const [isMute, setisMute] = useState(true);
  const [isPermissionMicrophone, setIsPermissionMicrophone] = useState(false);
  const containerRef = useRef<ScrollView>(null);
  const [ViewChat, setViewChat] = useState(false);

  useSpeechRecognitionEvent("result", async (event) => {
    setTranscript(event.results[0]?.transcript?.trim());
  });

  const SpeechTextStop = () => {
    ExpoSpeechRecognitionModule.stop();
  };
  const SpeechTextStart = () => {
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: true,
      requiresOnDeviceRecognition: true,
      addsPunctuation: false,
      androidIntent: "android.speech.action.RECOGNIZE_SPEECH",
      contextualStrings: ["Javscript", "html", "react", "node", "next.js"],
    });
  };

  const askChatGPT = async (message: string) => {
    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Please provide short and direct responses. Avoid long explanations, extra details, and focus only on the most essential information required to answer the question. ${message}`,
          },
        ], // Aquí el cambio

        model: "gpt-4o-mini",
      });

      const text = chatCompletion.choices[0]?.message?.content?.trim?.() ?? "";

      SpeechTextStop();
      Speech.speak(text, {
        onDone: () => {
          if (isMute) return;
          SpeechTextStart();
        },
      });

      setNewChat({
        type: "assistant",
        content: text,
      });
      containerRef.current?.scrollToEnd();
    } catch (error) {
      const text = `Error in ChatGPT API:, ${error}`;
      Speech.speak(text);

      setNewChat({
        type: "assistant",
        content: text,
      });
    }
  };

  useEffect(() => {
    if (transcript?.length === 0) return;
    const handler = setTimeout(() => {
      setNewChat({ type: "user", content: transcript });
      containerRef.current?.scrollToEnd();
      askChatGPT(transcript);
      setTranscript("");
    }, 800);
    return () => clearTimeout(handler); // Limpia el timeout si el usuario sigue escribiendo
  }, [transcript]);

  const handlePermission = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Microphone Access Denied", result);
      Alert.alert(
        "Microphone Access Denied",
        "We couldn't access the microphone because you didn't grant permission. Go to your device settings to enable it and use this feature.",
        [
          {
            isPreferred: true,
            text: "Go settings",
            onPress: () => Linking.openSettings(),
          },
          {
            text: "Ok",
          },
        ]
      );
      setIsPermissionMicrophone(false);
      return;
    }
    setIsPermissionMicrophone(true);
  };

  useEffect(() => {
    handlePermission();
  }, []);
  console.log(isMute, "isMute");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#030303",
      }}
    >
      <StatusBar style="light" translucent={false} backgroundColor="#030303" />
      <Valid isValid={ViewChat}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              color: "white",
            }}
          >
            Chat
          </Text>
        </View>
      </Valid>
      <ScrollView ref={containerRef} contentContainerStyle={{ flexGrow: 1 }}>
        <Valid isValid={!ViewChat}>
          <Assistant name="Whil" />
        </Valid>
        <Valid isValid={ViewChat}>
          <Chat />
        </Valid>
      </ScrollView>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 25,
          padding: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
            onPress={() => {
              setViewChat((prev) => !prev);
              containerRef.current?.scrollToEnd();
            }}
          >
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <G clip-path="url(#clip0_2097_748)">
                <Path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.97325 0.833008H9.02658C10.0953 0.833008 10.9333 0.833008 11.6026 0.896341C12.2846 0.961675 12.8433 1.09634 13.3359 1.39767C13.8519 1.71383 14.2858 2.14766 14.6019 2.66367C14.9033 3.15567 15.0379 3.71501 15.1033 4.39701C15.1666 5.06634 15.1666 5.90434 15.1666 6.97367V7.68501C15.1666 8.44567 15.1666 9.04234 15.1333 9.52434C15.0999 10.0143 15.0313 10.4223 14.8746 10.7997C14.6819 11.2648 14.3996 11.6874 14.0436 12.0434C13.6876 12.3993 13.265 12.6817 12.7999 12.8743C12.2633 13.097 11.6526 13.1463 10.8153 13.161C10.6086 13.1603 10.4019 13.1683 10.1959 13.185C10.0639 13.1997 10.0126 13.221 9.98258 13.2383C9.95125 13.257 9.90792 13.2903 9.83325 13.393C9.75258 13.5037 9.66125 13.657 9.51592 13.9023L9.15459 14.513C8.63925 15.3843 7.36125 15.3843 6.84525 14.513L6.48392 13.9023C6.38513 13.7283 6.27927 13.5584 6.16658 13.393C6.09192 13.2903 6.04858 13.257 6.01725 13.2383C5.98725 13.221 5.93592 13.1997 5.80392 13.185C5.66259 13.1697 5.47725 13.165 5.18392 13.1603C4.34725 13.1463 3.73659 13.097 3.19992 12.8743C2.73481 12.6817 2.31221 12.3993 1.95624 12.0434C1.60027 11.6874 1.3179 11.2648 1.12525 10.7997C0.968585 10.4223 0.899919 10.0143 0.865919 9.52434C0.833252 9.04234 0.833252 8.44567 0.833252 7.68434V6.97367C0.833252 5.90434 0.833252 5.06701 0.896585 4.39701C0.961919 3.71501 1.09659 3.15567 1.39792 2.66367C1.71407 2.14766 2.1479 1.71383 2.66392 1.39767C3.15592 1.09634 3.71525 0.961675 4.39725 0.896341C5.06659 0.833008 5.90459 0.833008 6.97392 0.833008M4.49258 1.89234C3.88325 1.95034 3.49592 2.06101 3.18659 2.25034C2.80506 2.48406 2.4843 2.80481 2.25059 3.18634C2.06125 3.49567 1.95059 3.88301 1.89259 4.49301C1.83392 5.10901 1.83325 5.89967 1.83325 7.00034V7.66701C1.83325 8.45034 1.83325 9.01301 1.86392 9.45701C1.89392 9.89634 1.95125 10.183 2.04925 10.4177C2.33682 11.1119 2.88837 11.6634 3.58259 11.951C3.92592 12.0937 4.36459 12.147 5.20192 12.1617H5.22259C5.48792 12.1663 5.72059 12.1703 5.91392 12.1917C6.12125 12.215 6.32458 12.261 6.51992 12.3743C6.71325 12.4877 6.85325 12.6377 6.97458 12.8043C7.08725 12.959 7.20258 13.1543 7.33325 13.375L7.70592 14.0043C7.73708 14.0542 7.78041 14.0953 7.83184 14.1238C7.88327 14.1524 7.94111 14.1673 7.99992 14.1673C8.05872 14.1673 8.11656 14.1524 8.16799 14.1238C8.21943 14.0953 8.26276 14.0542 8.29392 14.0043L8.66658 13.375C8.79725 13.1543 8.91325 12.959 9.02525 12.8043C9.14658 12.6377 9.28658 12.487 9.47992 12.3743C9.67525 12.261 9.87858 12.2143 10.0859 12.1917C10.2793 12.1703 10.5119 12.1663 10.7773 12.1617H10.7986C11.6353 12.147 12.0739 12.0937 12.4173 11.951C13.1115 11.6634 13.663 11.1119 13.9506 10.4177C14.0486 10.183 14.1059 9.89634 14.1359 9.45701C14.1666 9.01301 14.1666 8.45034 14.1666 7.66701V7.00034C14.1666 5.89967 14.1666 5.10901 14.1073 4.49234C14.0493 3.88301 13.9386 3.49567 13.7493 3.18634C13.5156 2.80513 13.1951 2.48462 12.8139 2.25101C12.5046 2.06167 12.1173 1.95101 11.5073 1.89301C10.8913 1.83434 10.1006 1.83367 8.99992 1.83367H6.99992C5.89925 1.83367 5.10858 1.83367 4.49192 1.89301M4.83325 5.99967C4.83325 5.86707 4.88593 5.73989 4.9797 5.64612C5.07347 5.55235 5.20064 5.49967 5.33325 5.49967H10.6666C10.7992 5.49967 10.9264 5.55235 11.0201 5.64612C11.1139 5.73989 11.1666 5.86707 11.1666 5.99967C11.1666 6.13228 11.1139 6.25946 11.0201 6.35323C10.9264 6.447 10.7992 6.49967 10.6666 6.49967H5.33325C5.20064 6.49967 5.07347 6.447 4.9797 6.35323C4.88593 6.25946 4.83325 6.13228 4.83325 5.99967ZM4.83325 8.33301C4.83325 8.2004 4.88593 8.07322 4.9797 7.97945C5.07347 7.88569 5.20064 7.83301 5.33325 7.83301H8.99992C9.13253 7.83301 9.2597 7.88569 9.35347 7.97945C9.44724 8.07322 9.49992 8.2004 9.49992 8.33301C9.49992 8.46562 9.44724 8.59279 9.35347 8.68656C9.2597 8.78033 9.13253 8.83301 8.99992 8.83301H5.33325C5.20064 8.83301 5.07347 8.78033 4.9797 8.68656C4.88593 8.59279 4.83325 8.46562 4.83325 8.33301Z"
                  fill="white"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_2097_748">
                  <Rect width="16" height="16" fill="white" />
                </ClipPath>
              </Defs>
            </Svg>
            <Text
              style={{
                color: "white",
              }}
            >
              Press to {ViewChat ? "hide" : "view"} chat.
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[styles.touchable, isMute ? styles.touchable_muted : {}]}
            onPress={() => {
              if (!isPermissionMicrophone) return;
              if (isMute === false) {
                setisMute(true);
                SpeechTextStop();
                return;
              }
              setisMute(false);
              SpeechTextStart();
              return;
            }}
          >
            <Valid isValid={!isMute}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V11C9 12.6569 10.3431 14 12 14C13.6569 14 15 12.6569 15 11V6Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M19 11C19 11.9193 18.8189 12.8295 18.4672 13.6788C18.1154 14.5281 17.5998 15.2997 16.9497 15.9497C16.2997 16.5998 15.5281 17.1154 14.6788 17.4672C13.8295 17.8189 12.9193 18 12 18M12 18C11.0807 18 10.1705 17.8189 9.32122 17.4672C8.47194 17.1154 7.70026 16.5998 7.05025 15.9497C6.40024 15.2997 5.88463 14.5281 5.53284 13.6788C5.18106 12.8295 5 11.9193 5 11M12 18V21"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Valid>
            <Valid isValid={isMute}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  opacity="0.16"
                  d="M9 11C8.99987 11.5328 9.14163 12.056 9.41071 12.5158C9.67979 12.9757 10.0665 13.3556 10.531 13.6165C10.9956 13.8773 11.5212 14.0098 12.0539 14.0002C12.5866 13.9907 13.1071 13.8394 13.562 13.562L9 9V11Z"
                  fill="#EB4949"
                />
                <Path
                  d="M19 11.0003C19 11.7103 18.894 12.3953 18.698 13.0403M12 18.0003C10.1435 18.0003 8.36301 17.2628 7.05025 15.95C5.7375 14.6373 5 12.8568 5 11.0003M12 18.0003V21.0003M12 18.0003C13.6129 18.0028 15.1768 17.4458 16.425 16.4243M9.714 4.05727C10.1117 3.58934 10.6433 3.25472 11.2372 3.09859C11.8311 2.94246 12.4586 2.97234 13.035 3.1842C13.6114 3.39606 14.1089 3.77969 14.4603 4.28329C14.8117 4.78689 15.0001 5.38619 15 6.00027V9.34327M9 9.00027V11.0003C8.99987 11.5331 9.14163 12.0563 9.41071 12.5161C9.67979 12.976 10.0665 13.3558 10.531 13.6167C10.9956 13.8776 11.5212 14.0101 12.0539 14.0005C12.5866 13.9909 13.1071 13.8397 13.562 13.5623"
                  stroke="#EB4949"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M4 4L20 20"
                  stroke="#EB4949"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Valid>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: "#EBEBEB",
    width: 70,
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 70,
  },
  touchable_muted: {
    backgroundColor: "#F4CDCD",
  },
});
