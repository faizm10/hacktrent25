import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

import createPlayer from "play-sound";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "ZauUyVXAz5znrgRuElJ5";

export class ElevenLabsSpeaker {
  private client?: ElevenLabsClient;
  private readonly voiceId: string;

  constructor(private readonly options?: { modelId?: string; outputFormat?: string }) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    this.voiceId = DEFAULT_VOICE_ID;

    if (apiKey) {
      this.client = new ElevenLabsClient({
        apiKey,
        environment: "https://api.elevenlabs.io",
      });
    } else {
      console.warn(
        "[ElevenLabsSpeaker] ELEVENLABS_API_KEY missing. Responses will not be voiced; text will be printed only."
      );
    }
  }

  public isAvailable() {
    return Boolean(this.client);
  }

  public async speak(text: string) {
    if (!this.client) {
      console.log(`🤖 ${text}`);
      return;
    }

    const response = await this.client.textToSpeech.convert(this.voiceId, {
      text,
      modelId: this.options?.modelId ?? "eleven_multilingual_v2",
      outputFormat: this.options?.outputFormat ?? "mp3_44100_128",
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    const tempDir = await mkdtemp(join(tmpdir(), "echolag-tts-"));
    const filePath = join(tempDir, `reply-${randomUUID()}.mp3`);

    await writeFile(filePath, audioBuffer);

    const player = createPlayer();

    await new Promise<void>((resolve, reject) => {
      player.play(filePath, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    await rm(tempDir, { recursive: true, force: true });
  }
}

