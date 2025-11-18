import { Injectable, inject, signal, computed } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { RoomService } from './room.service';
import { Card, Room } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private firebaseService = inject(FirebaseService);
  private roomService = inject(RoomService);

  createDeck(): Card[] {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Card['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck: Card[] = [];

    suits.forEach((suit) => {
      ranks.forEach((rank, index) => {
        let value = index + 1;
        if (rank === 'A') value = 1;
        if (rank === 'J') value = 11;
        if (rank === 'Q') value = 12;
        if (rank === 'K') value = 13;

        deck.push({ suit, rank, value });
      });
    });

    return this.shuffleDeck(deck);
  }

  private shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async dealCards(roomCode: string): Promise<void> {
    const room = (await this.firebaseService.get(`rooms/${roomCode}`)) as Room;
    if (!room || room.players.length < 2) {
      return;
    }

    const deck = this.createDeck();
    const cardsPerPlayer = Math.floor(deck.length / room.players.length);
    const playersWithCards = room.players.map((player, index) => {
      const startIndex = index * cardsPerPlayer;
      const endIndex = startIndex + cardsPerPlayer;
      return {
        ...player,
        cards: deck.slice(startIndex, endIndex),
      };
    });

    const remainingDeck = deck.slice(playersWithCards.length * cardsPerPlayer);

    await this.firebaseService.update(`rooms/${roomCode}`, {
      players: playersWithCards,
      deck: remainingDeck,
      currentTurn: playersWithCards[0].id,
    });
  }

  async playCard(roomCode: string, playerId: string, cardIndex: number): Promise<void> {
    const room = (await this.firebaseService.get(`rooms/${roomCode}`)) as Room;
    if (!room || room.currentTurn !== playerId) {
      return;
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player || cardIndex >= player.cards.length) {
      return;
    }

    const card = player.cards[cardIndex];
    const updatedCards = player.cards.filter((_, i) => i !== cardIndex);
    const updatedPlayers = room.players.map((p) =>
      p.id === playerId ? { ...p, cards: updatedCards } : p
    );

    const nextPlayerIndex = (room.players.findIndex((p) => p.id === playerId) + 1) % room.players.length;
    const nextPlayerId = room.players[nextPlayerIndex].id;

    await this.firebaseService.update(`rooms/${roomCode}`, {
      players: updatedPlayers,
      discardPile: [...room.discardPile, card],
      currentTurn: nextPlayerId,
    });
  }

  async drawCard(roomCode: string, playerId: string): Promise<void> {
    const room = (await this.firebaseService.get(`rooms/${roomCode}`)) as Room;
    if (!room || room.currentTurn !== playerId || room.deck.length === 0) {
      return;
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      return;
    }

    const drawnCard = room.deck[0];
    const updatedDeck = room.deck.slice(1);
    const updatedPlayers = room.players.map((p) =>
      p.id === playerId ? { ...p, cards: [...p.cards, drawnCard] } : p
    );

    const nextPlayerIndex = (room.players.findIndex((p) => p.id === playerId) + 1) % room.players.length;
    const nextPlayerId = room.players[nextPlayerIndex].id;

    await this.firebaseService.update(`rooms/${roomCode}`, {
      players: updatedPlayers,
      deck: updatedDeck,
      currentTurn: nextPlayerId,
    });
  }
}

