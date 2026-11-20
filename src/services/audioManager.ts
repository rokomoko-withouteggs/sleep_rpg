export class AudioManager {
  private current?: HTMLAudioElement;

  async play(key: string): Promise<void> {
    const tracks: Record<string, string> = {
      home: '/assets/audio/home.mp3',
      battle: '/assets/audio/battle.mp3',
      story: '/assets/audio/story.mp3',
    };
    const source = tracks[key];
    if (!source) return;
    this.current?.pause();
    this.current = new Audio(source);
    this.current.loop = true;
    await this.current.play().catch(() => undefined);
  }

  stop(): void {
    this.current?.pause();
  }
}

export const audioManager = new AudioManager();
