import { Component, input } from '@angular/core';
import { Card } from '../../models/room.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  card = input<Card | null>(null);
  isPlayable = input<boolean>(false);
  isSelected = input<boolean>(false);
  isFaceDown = input<boolean>(false);

  get suitSymbol(): string {
    const card = this.card();
    if (!card) return '';
    const symbols: Record<Card['suit'], string> = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    };
    return symbols[card.suit];
  }

  get suitColor(): string {
    const card = this.card();
    if (!card) return '';
    return card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
  }
}

