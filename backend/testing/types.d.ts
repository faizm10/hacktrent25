declare module "node-record-lpcm16" {
  import { Readable } from "node:stream";

  interface RecordStartOptions {
    sampleRate?: number;
    threshold?: number;
    verbose?: boolean;
    recordProgram?: "rec" | "sox" | "arecord";
    silence?: string;
  }

  interface Recorder extends Readable {}

  interface RecordModule {
    start(options?: RecordStartOptions): Recorder;
    stop(): void;
  }

  const record: RecordModule;
  export = record;
}

declare module "play-sound" {
  interface Player {
    play(file: string, callback?: (err?: Error | null) => void): void;
  }

  function createPlayer(options?: Record<string, unknown>): Player;

  export = createPlayer;
}

