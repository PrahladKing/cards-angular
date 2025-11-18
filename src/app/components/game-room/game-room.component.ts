import { Component, inject, signal, computed, effect, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/room.service';
import { GameService } from '../../services/game.service';
import { CardComponent } from '../card/card.component';
import { Room, Player, Card } from '../../models/room.model';

@Component({
  selector: 'app-game-room',
  imports: [CommonModule, CardComponent],
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.scss',
})
export class GameRoomComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomService = inject(RoomService);
  private gameService = inject(GameService);

  room = this.roomService.room;
  currentPlayer = this.roomService.player;
  selectedCardIndex = signal<number | null>(null);

  isMyTurn = computed(() => {
    const room = this.room();
    const player = this.currentPlayer();
    return room?.currentTurn === player?.id;
  });

  canPlayCard = computed(() => {
    return this.isMyTurn() && this.selectedCardIndex() !== null;
  });

  otherPlayers = computed(() => {
    const room = this.room();
    const player = this.currentPlayer();
    if (!room || !player) return [];
    return room.players.filter((p) => p.id !== player.id);
  });

  myCards = computed(() => {
    const player = this.currentPlayer();
    return player?.cards || [];
  });

  topDiscardCard = computed(() => {
    const room = this.room();
    if (!room || room.discardPile.length === 0) return null;
    return room.discardPile[room.discardPile.length - 1];
  });

  constructor() {
    effect(async () => {
      const room = this.room();
      if (!room) {
        await this.router.navigate(['/']);
      }
    });
  }

  async ngOnDestroy(): Promise<void> {
    await this.roomService.leaveRoom();
  }

  selectCard(index: number): void {
    if (!this.isMyTurn()) return;
    if (this.selectedCardIndex() === index) {
      this.selectedCardIndex.set(null);
    } else {
      this.selectedCardIndex.set(index);
    }
  }

  async playCard(): Promise<void> {
    const room = this.room();
    const player = this.currentPlayer();
    const cardIndex = this.selectedCardIndex();

    if (!room || !player || cardIndex === null || !this.isMyTurn()) {
      return;
    }

    await this.gameService.playCard(room.code, player.id, cardIndex);
    this.selectedCardIndex.set(null);
  }

  async drawCard(): Promise<void> {
    const room = this.room();
    const player = this.currentPlayer();

    if (!room || !player || !this.isMyTurn()) {
      return;
    }

    await this.gameService.drawCard(room.code, player.id);
  }

  async startGame(): Promise<void> {
    const room = this.room();
    if (!room || !this.currentPlayer()?.isHost) return;

    await this.roomService.startGame();
    await this.gameService.dealCards(room.code);
  }

  async leaveRoom(): Promise<void> {
    await this.roomService.leaveRoom();
    await this.router.navigate(['/']);
  }

  getPlayerName(player: Player): string {
    return player.name + (player.isHost ? ' (Host)' : '');
  }
}

