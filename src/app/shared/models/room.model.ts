export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  cards: Card[];
  score: number;
}

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  value: number;
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  currentTurn: string | null;
  deck: Card[];
  discardPile: Card[];
  createdAt: number;
  maxPlayers: number;
}

