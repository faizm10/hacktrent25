# Voice Conversation Test Harness

This folder contains an experimental microphone-driven conversation loop that
lets you speak to the Gemini-powered barista bot and hear its ElevenLabs voice
responses without touching the production API code.

## Prerequisites

1. **Node.js 18+**
2. **Microphone access** (macOS: grant Terminal / VS Code access in System Settings → Privacy & Security → Microphone).
3. **System dependencies**
   - macOS: `brew install sox` (provides the `rec` binary for microphone capture) and ensure `afplay` is available for playback.
   - Linux: install `sox` and a command line audio player such as `aplay` or `mpg123` (used by `play-sound`).
4. Environment variables:
   - `GEMINI_API_KEY` – same key used by the backend service.
   - `ELEVENLABS_API_KEY` – a key with access to the `ZauUyVXAz5znrgRuElJ5` (Callum) voice.
   - `GOOGLE_APPLICATION_CREDENTIALS` – optional, only required if you switch the speech recognizer to Google Cloud (see notes below).

## Installation

From `/Applications/vscode/hacktrent25/backend` run:

```bash
npm install node-record-lpcm16 @google-cloud/speech @elevenlabs/elevenlabs-js play-sound
### Python harness

If you prefer the Python test harness (`python main.py`):

```bash
cd /Applications/vscode/hacktrent25/backend/testing
pip install -r requirements.txt
```

> **Note:** On macOS you may need `brew install portaudio` before installing `PyAudio`.
```

These packages are only used for the manual testing harness and are not required in production.

## Running the Test Loop

```bash
npx ts-node testing/voiceConversation.ts
```

### Workflow

1. **Press Enter** to start recording.
2. Speak your phrase. Recording stops automatically after ~8 seconds of silence or when you hit `Ctrl+C`.
3. The captured audio is transcribed locally and sent to Gemini using the existing `GeminiService`.
4. The generated reply is synthesized via ElevenLabs (Callum voice) and played back.
5. The conversation state is preserved so Gemini keeps context between turns.

### Shortcuts

- `Ctrl+C` cancels recording or exits the session.
- Type `/reset` at the prompt to clear conversation history.
- Type `/text Hello` to send text directly without using the microphone.

## Speech Recognition Notes

By default the harness uses the `@google-cloud/speech` streaming recognizer. If you
prefer a fully local approach, swap the recognizer implementation in
`testing/speech/transcriber.ts` with any other transcription library.

## Limitations

- This is **not** wired into Express routes; it is a developer tool only.
- Gemini + ElevenLabs requests are sequential, so round-trip latency depends on your network.
- Audio files are written to a temporary directory before playback and deleted afterwards.

Feel free to tweak the helpers inside this folder to match your workflow.

