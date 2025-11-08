"""
Interactive voice conversation harness (Python edition).

Requirements:
    pip install speechrecognition pyaudio google-generativeai elevenlabs playsound

Environment variables:
    GEMINI_API_KEY         - Google Gemini API key
    ELEVENLABS_API_KEY     - ElevenLabs API key with access to the Callum voice
    ELEVENLABS_VOICE_ID    - Optional override for the ElevenLabs voice ID

Usage:
    python backend/testing/python_main.py
"""

from __future__ import annotations

import os
import sys
import tempfile
from dataclasses import dataclass, field
import types
from typing import List

try:
    from distutils.version import LooseVersion  # type: ignore
except ModuleNotFoundError:  # Python 3.12+
    from packaging.version import Version

    class _LooseVersion(Version):  # minimal shim matching distutils API
        def __lt__(self, other):
            return super().__lt__(Version(str(other)))

        def __le__(self, other):
            return super().__le__(Version(str(other)))

        def __gt__(self, other):
            return super().__gt__(Version(str(other)))

        def __ge__(self, other):
            return super().__ge__(Version(str(other)))

    distutils_module = types.ModuleType("distutils")
    version_module = types.ModuleType("version")
    version_module.LooseVersion = _LooseVersion
    distutils_module.version = version_module
    sys.modules["distutils"] = distutils_module
    sys.modules["distutils.version"] = version_module

import google.generativeai as genai
import speech_recognition as sr
from elevenlabs import ElevenLabs
from playsound import playsound

DEFAULT_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "ZauUyVXAz5znrgRuElJ5")
ORDER_KEYS = ("drink", "size", "milk", "name")


def require_env(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return value


def configure_clients() -> tuple[genai.GenerativeModel, ElevenLabs]:
    genai.configure(api_key=require_env("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-2.0-flash")

    elevenlabs_client = ElevenLabs(api_key=require_env("ELEVENLABS_API_KEY"))
    return model, elevenlabs_client


@dataclass
class ConversationState:
    order_state: dict = field(default_factory=lambda: {key: False for key in ORDER_KEYS})
    history: List[dict] = field(default_factory=list)

    def reset(self):
        for key in self.order_state:
            self.order_state[key] = False
        self.history.clear()

    def update_from_user(self, message: str):
        self.history.append({"role": "user", "content": message})
        lower = message.lower()

        if not self.order_state["drink"] and any(
            kw in lower for kw in ["latte", "coffee", "espresso", "tea", "matcha", "mocha"]
        ):
            self.order_state["drink"] = True
        if not self.order_state["size"] and any(
            kw in lower for kw in ["small", "medium", "large", "tall", "grande", "venti"]
        ):
            self.order_state["size"] = True
        if not self.order_state["milk"] and any(
            kw in lower for kw in ["whole", "oat", "almond", "soy", "milk", "cream"]
        ):
            self.order_state["milk"] = True
        if not self.order_state["name"] and any(
            kw in lower for kw in ["my name", "name is", "i am", "call me"]
        ):
            self.order_state["name"] = True

    def add_assistant(self, message: str):
        self.history.append({"role": "assistant", "content": message})


BARISTA_PROMPT = """You are a friendly barista at a coffee shop. Your goal is to help customers place their orders efficiently while maintaining a warm, professional demeanor. Follow these guidelines:

1. Always acknowledge the customer's input
2. Guide them through the order process (drink → size → milk → name)
3. Ask clarifying questions when needed
4. Provide gentle corrections if needed
5. Stay in character as a barista
6. Keep responses concise and natural
7. Never break character or mention that you are an AI

Remember to respond like a real barista would in a coffee shop conversation.
Current order progress will be provided in the conversation context."""


def build_prompt(state: ConversationState, user_message: str) -> str:
    order_progress = "\n".join(
        f"{key}: {'completed' if state.order_state[key] else 'pending'}" for key in ORDER_KEYS
    )
    conversation_context = "\n".join(
        f"{entry['role']}: {entry['content']}" for entry in state.history[-8:]
    )
    return (
        f"{BARISTA_PROMPT}\n\n"
        f"Order Progress:\n{order_progress}\n\n"
        f"Previous Conversation:\n{conversation_context}\n\n"
        f"Customer's latest message: \"{user_message}\"\n\n"
        "Respond as the barista:"
    )


def capture_audio(recognizer: sr.Recognizer, microphone: sr.Microphone) -> str | None:
    print("🎙️  Speak now (Ctrl+C to exit)...")
    with microphone as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source, phrase_time_limit=10)

    print("📝 Transcribing...")
    try:
        text = recognizer.recognize_google(audio)
        print(f"🗣️  You said: {text}")
        return text
    except sr.UnknownValueError:
        print("🤷 Speech not recognized. Please try again.")
        return None
    except sr.RequestError as exc:
        print(f"⚠️ Speech recognition error: {exc}")
        return None


def synthesize_and_play(eleven_client: ElevenLabs, message: str):
    print("🎧 Generating audio response...")
    audio = eleven_client.generate(
        text=message,
        voice=DEFAULT_VOICE_ID,
        model="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
        tmp_file.write(audio)
        tmp_path = tmp_file.name

    try:
        playsound(tmp_path)
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass


def main():
    try:
        model, elevenlabs_client = configure_clients()
    except RuntimeError as exc:
        print(exc)
        sys.exit(1)

    recognizer = sr.Recognizer()
    microphone = sr.Microphone()
    state = ConversationState()

    print("☕ EchoLag Python voice harness")
    print("Press Enter to speak, type '/reset' to clear context, or '/exit' to quit.\n")

    while True:
        try:
            user_input = input("➜ ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n👋 Goodbye!")
            break

        if user_input.lower() == "/exit":
            print("👋 Conversation ended.")
            break

        if user_input.lower() == "/reset":
            state.reset()
            print("🔄 Conversation reset.")
            continue

        if not user_input:
            try:
                user_input = capture_audio(recognizer, microphone) or ""
            except (KeyboardInterrupt, EOFError):
                print("\n👋 Goodbye!")
                break

        if not user_input:
            continue

        state.update_from_user(user_input)
        prompt = build_prompt(state, user_input)

        print("🤖 Asking Gemini...")
        try:
            response = model.generate_content(prompt)
            assistant_message = response.text.strip()
        except Exception as exc:  # pylint: disable=broad-except
            print(f"⚠️ Gemini request failed: {exc}")
            continue

        state.add_assistant(assistant_message)
        print(f"☕ Barista: {assistant_message}")

        try:
            synthesize_and_play(elevenlabs_client, assistant_message)
        except Exception as exc:  # pylint: disable=broad-except
            print(f"🔇 Failed to generate audio: {exc}")


if __name__ == "__main__":
    main()

