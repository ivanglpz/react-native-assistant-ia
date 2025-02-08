import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import OpenAI from "openai";
import { useState } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const client = new OpenAI({
  apiKey: API_KEY, // This is the default and can be omitted
});
const askChatGPT = async (message: string) => {
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: "user", content: message }], // Aquí el cambio
      model: "gpt-4o-mini",
    });

    console.log(chatCompletion.choices[0]?.message?.content || "No response");
    return chatCompletion.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error in ChatGPT API:", error);
  }
};

export default function App() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: true,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
      // androidIntentOptions: {
      //   EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000,
      //   EXTRA_MASK_OFFENSIVE_WORDS: false,
      // },
    });
  };
  // const handle2 = async () => {
  //   const response = await askChatGPT(
  //     "Hello, how are you? I'm creating a new app using ChatGPT API."
  //   );

  //   if (response) {
  //     console.log("ChatGPT response:", response);
  //   } else {
  //     console.log("No response from ChatGPT.");
  //   }
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        {!recognizing ? (
          <Button title="Start" onPress={handleStart} />
        ) : (
          <Button
            title="Stop"
            onPress={() => ExpoSpeechRecognitionModule.stop()}
          />
        )}
        {/* <Button title="ask" onPress={handle2} /> */}
        <ScrollView>
          <Text>Hello world</Text>

          <Text>{transcript}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
