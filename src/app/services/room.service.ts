import { Injectable, inject, signal, computed } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Room, Player } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private firebaseService = inject(FirebaseService);
  private currentRoom = signal<Room | null>(null);
  private currentPlayer = signal<Player | null>(null);
  private unsubscribeRoom: (() => void) | null = null;

  readonly room = this.currentRoom.asReadonly();
  readonly player = this.currentPlayer.asReadonly();
  readonly isInRoom = computed(() => this.currentRoom() !== null);

  generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async createRoom(playerName: string): Promise<string> {
    const playerId = this.generatePlayerId();
    const roomCode = this.generateRoomCode();
    const host: Player = {
      id: playerId,
      name: playerName,
      isHost: true,
      cards: [],
      score: 0,
    };

    const room: Room = {
      id: roomCode,
      code: roomCode,
      hostId: playerId,
      players: [host],
      status: 'waiting',
      currentTurn: null,
      deck: [],
      discardPile: [],
      createdAt: Date.now(),
      maxPlayers: 4,
    };

    await this.firebaseService.set(`rooms/${roomCode}`, room);
    this.currentPlayer.set(host);
    this.subscribeToRoom(roomCode);
    return roomCode;
  }

  async joinRoom(roomCode: string, playerName: string): Promise<boolean> {
    try {
      const roomData = (await this.firebaseService.get(`rooms/${roomCode}`)) as Room | null;
      if (!roomData) {
        return false;
      }

      if (roomData.players.length >= roomData.maxPlayers) {
        return false;
      }

      if (roomData.status !== 'waiting') {
        return false;
      }

      const playerId = this.generatePlayerId();
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        isHost: false,
        cards: [],
        score: 0,
      };

      const updatedPlayers = [...roomData.players, newPlayer];
      await this.firebaseService.update(`rooms/${roomCode}`, {
        players: updatedPlayers,
      });

      this.currentPlayer.set(newPlayer);
      this.subscribeToRoom(roomCode);
      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      return false;
    }
  }

  async leaveRoom(): Promise<void> {
    const room = this.currentRoom();
    const player = this.currentPlayer();

    if (!room || !player) {
      return;
    }

    if (this.unsubscribeRoom) {
      this.unsubscribeRoom();
      this.unsubscribeRoom = null;
    }

    const updatedPlayers = room.players.filter((p) => p.id !== player.id);

    if (updatedPlayers.length === 0) {
      await this.firebaseService.remove(`rooms/${room.code}`);
    } else {
      if (player.isHost && updatedPlayers.length > 0) {
        updatedPlayers[0].isHost = true;
        await this.firebaseService.update(`rooms/${room.code}`, {
          players: updatedPlayers,
          hostId: updatedPlayers[0].id,
        });
      } else {
        await this.firebaseService.update(`rooms/${room.code}`, {
          players: updatedPlayers,
        });
      }
    }

    this.currentRoom.set(null);
    this.currentPlayer.set(null);
  }

  private subscribeToRoom(roomCode: string): void {
    if (this.unsubscribeRoom) {
      this.unsubscribeRoom();
    }

    this.unsubscribeRoom = this.firebaseService.subscribe(`rooms/${roomCode}`, (data) => {
      if (data) {
        this.currentRoom.set(data as Room);
      } else {
        this.currentRoom.set(null);
        this.currentPlayer.set(null);
      }
    });
  }

  private generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async startGame(): Promise<void> {
    const room = this.currentRoom();
    if (!room || !this.currentPlayer()?.isHost) {
      return;
    }

    await this.firebaseService.update(`rooms/${room.code}`, {
      status: 'playing',
    });
  }
}

