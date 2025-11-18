import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private roomService = inject(RoomService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  createRoomForm = this.fb.group({
    playerName: ['', [Validators.required, Validators.minLength(2)]],
  });

  joinRoomForm = this.fb.group({
    playerName: ['', [Validators.required, Validators.minLength(2)]],
    roomCode: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6}$/)]],
  });

  async onCreateRoom(): Promise<void> {
    if (this.createRoomForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const playerName = this.createRoomForm.value.playerName || '';
      const roomCode = await this.roomService.createRoom(playerName);
      await this.router.navigate(['/room', roomCode]);
    } catch (error) {
      this.errorMessage.set('Failed to create room. Please try again.');
      console.error('Error creating room:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onJoinRoom(): Promise<void> {
    if (this.joinRoomForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const playerName = this.joinRoomForm.value.playerName || '';
      const roomCode = (this.joinRoomForm.value.roomCode || '').toUpperCase();
      const success = await this.roomService.joinRoom(roomCode, playerName);

      if (success) {
        await this.router.navigate(['/room', roomCode]);
      } else {
        this.errorMessage.set('Room not found or is full. Please check the room code.');
      }
    } catch (error) {
      this.errorMessage.set('Failed to join room. Please try again.');
      console.error('Error joining room:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}

