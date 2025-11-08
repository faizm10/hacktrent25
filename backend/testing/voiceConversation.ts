import "dotenv/config";

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { GeminiService } from "../src/services/geminiService";
import type { ConversationRequest, Message, OrderState } from "../src/types/conversation";
import { SpeechTranscriber } from "./speech/transcriber";
import { ElevenLabsSpeaker } from "./audio/speaker";

const orderState: OrderState = {
  drink: false,
  size: false,
  milk: false,
  name: false,
};

const conversationHistory: Message[] = [];

const gemini = new GeminiService();
const transcriber = new SpeechTranscriber();
const speaker = new ElevenLabsSpeaker();

function updateOrderState(message: string) {
  const text = message.toLowerCase();
  if (!orderState.drink && /(latte|coffee|espresso|tea|matcha|cappuccino|mocha)/.test(text)) {
    orderState.drink = true;
  }
  if (!orderState.size && /(tall|grande|venti|small|medium|large)/.test(text)) {
    orderState.size = true;
  }
  if (!orderState.milk && /(whole|oat|almond|soy|milk|cream)/.test(text)) {
    orderState.milk = true;
  }
  if (!orderState.name && /(name is|i'm|i am|call me|my name)/.test(text)) {
    orderState.name = true;
  }
}

async function captureUserMessage(initialInput: string): Promise<string | null> {
  if (initialInput.trim() === "") {
    if (!transcriber.isAvailable()) {
      console.log("🎤 Microphone capture unavailable. Please type your message instead.");
      const typed = await rl.question("Type your message: ");
      return typed.trim() === "" ? null : typed;
    }

    try {
      const result = await transcriber.recordOnce();
      if (!result) {
        console.log("🤷 No speech detected.");
        return null;
      }

      console.log(`📝 You said: "${result.transcript}"`);
      return result.transcript;
    } catch (error) {
      console.error("⚠️ Speech transcription failed:", error);
      return null;
    }
  }

  if (initialInput.startsWith("/text ")) {
    return initialInput.slice(6).trim();
  }

  return initialInput.trim();
}

async function handleIteration(initialInput: string) {
  const userMessage = await captureUserMessage(initialInput);
  if (!userMessage) {
    return;
  }

  if (userMessage.toLowerCase() === "/reset") {
    conversationHistory.length = 0;
    Object.keys(orderState).forEach((key) => {
      (orderState as Record<string, boolean>)[key] = false;
    });
    console.log("🔄 Conversation reset.");
    return;
  }

  console.log(`🗣️  User: ${userMessage}`);
  conversationHistory.push({ role: "user", content: userMessage });
  updateOrderState(userMessage);

  const request: ConversationRequest = {
    userMessage,
    orderState,
    conversationHistory,
  };

  const response = await gemini.handleConversation(request);
  conversationHistory.push({ role: "assistant", content: response.message });

  try {
    await speaker.speak(response.message);
  } catch (error) {
    console.error("🔇 Failed to play audio response:", error);
    console.log(`Assistant: ${response.message}`);
  }
}

const rl = createInterface({ input, output });

async function main() {
  console.log("☕ EchoLag voice testing harness");
  console.log("Press Enter to speak, type '/reset' to clear context, or '/exit' to quit.\n");

  let active = true;
  rl.on("SIGINT", () => {
    active = false;
    rl.close();
  });

  while (active) {
    const userPrompt = await rl.question("➜ ");
    if (userPrompt.trim().toLowerCase() === "/exit") {
      break;
    }

    try {
      await handleIteration(userPrompt);
    } catch (error) {
      console.error("⚠️ Unable to process turn:", error);
    }
  }

  rl.close();
  console.log("👋 Conversation ended.");
}

main().catch((error) => {
  console.error("Fatal error in testing harness:", error);
  process.exit(1);
});

