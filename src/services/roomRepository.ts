export interface RoomParticipant {
  id: string;
  name: string;
  avatarId: string;
  isSelf: boolean;
  sleepRank: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface RoomState {
  code: string;
  bossId: string;
  participants: RoomParticipant[];
}

export class LocalRoomRepository {
  private key(code: string): string {
    return `sleep-rpg:room:${code}`;
  }

  create(code: string, participant: RoomParticipant): RoomState {
    const room: RoomState = { code, bossId: 'weekend-insomnia', participants: [participant] };
    localStorage.setItem(this.key(code), JSON.stringify(room));
    return room;
  }

  join(code: string, participant: RoomParticipant): RoomState {
    const raw = localStorage.getItem(this.key(code));
    const room: RoomState = raw ? JSON.parse(raw) : { code, bossId: 'weekend-insomnia', participants: [] };
    room.participants = [...room.participants.filter((item) => item.id !== participant.id), participant];
    localStorage.setItem(this.key(code), JSON.stringify(room));
    return room;
  }

  get(code: string): RoomState | null {
    const raw = localStorage.getItem(this.key(code));
    return raw ? JSON.parse(raw) as RoomState : null;
  }
}
