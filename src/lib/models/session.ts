export enum SessionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export interface GameSession {
  id: string;
  gameId: string;
  playerIds: string[];
  status: SessionStatus;
  startedAt: Date;
  completedAt?: Date;
  notes?: string;
}
