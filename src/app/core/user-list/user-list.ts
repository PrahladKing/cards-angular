import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../shared/services/auth-service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private router = inject(Router);
  private authService = inject(AuthService);

  users = signal<User[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.isLoading.set(true);
    try {
      const usersList = await this.authService.getUserList();
      this.users.set(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  navigateToAddUser(): void {
    this.router.navigate(['/admin/add-user']);
  }
}
