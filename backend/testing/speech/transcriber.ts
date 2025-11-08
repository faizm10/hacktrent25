import record from "node-record-lpcm16";
import { SpeechClient } from "@google-cloud/speech";

interface TranscriptionResult {
  transcript: string;
  confidence?: number;
}

export class SpeechTranscriber {
  private readonly speechClient?: SpeechClient;
  private readonly sampleRate: number;
  private readonly silenceDuration: string;
  private readonly maxRecordingMs: number;

  constructor(options?: { sampleRate?: number; silenceSeconds?: number; maxSeconds?: number }) {
    this.sampleRate = options?.sampleRate ?? 16000;
    this.silenceDuration = `${options?.silenceSeconds ?? 1.5}`;
    this.maxRecordingMs = (options?.maxSeconds ?? 12) * 1000;

    try {
      this.speechClient = new SpeechClient();
    } catch (error) {
      console.warn(
        "[SpeechTranscriber] Unable to load @google-cloud/speech client. Falling back to text input only.",
        error
      );
    }
  }

  public isAvailable() {
    return Boolean(this.speechClient);
  }

  public async recordOnce(): Promise<TranscriptionResult | null> {
    if (!this.speechClient) {
      throw new Error("Speech client unavailable. Ensure Google Cloud credentials are configured.");
    }

    const chunks: Buffer[] = [];
    let timeout: NodeJS.Timeout | undefined;

    return new Promise((resolve, reject) => {
      console.log("🎙️  Listening... speak now.");
      const stream = record.start({
        sampleRate: this.sampleRate,
        threshold: 0.5,
        verbose: false,
        recordProgram: process.platform === "darwin" ? "rec" : undefined,
        silence: this.silenceDuration,
      });

      stream.on("data", (data: Buffer) => {
        chunks.push(data);
      });

      stream.on("error", (error: Error) => {
        clearTimeout(timeout);
        record.stop();
        reject(error);
      });

      stream.on("close", async () => {
        clearTimeout(timeout);
        if (chunks.length === 0) {
          resolve(null);
          return;
        }

        try {
          const audioBytes = Buffer.concat(chunks).toString("base64");
          const [response] = await this.speechClient!.recognize({
            audio: { content: audioBytes },
            config: {
              encoding: "LINEAR16",
              sampleRateHertz: this.sampleRate,
              languageCode: "en-US",
              enableAutomaticPunctuation: true,
            },
          });

          const transcription = response.results?.[0]?.alternatives?.[0];
          if (!transcription?.transcript) {
            resolve(null);
            return;
          }

          resolve({
            transcript: transcription.transcript.trim(),
            confidence: transcription.confidence ?? undefined,
          });
        } catch (error) {
          reject(error);
        }
      });

      timeout = setTimeout(() => {
        console.log("⏱️  Time limit reached, processing recording.");
        record.stop();
      }, this.maxRecordingMs);
    });
  }
}

