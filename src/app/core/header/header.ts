import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  showDropdown = false;
  userName = 'User'; // Default name, can be retrieved from localStorage or service

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  constructor() {
    // Try to get user name from localStorage
    // const storedName = localStorage.getItem('c-user-name');
    // if (storedName) {
    //   this.userName = storedName;
    // }
  }

  addUser() {
    this.router.navigate(['/admin/users']);
  }

  logout() {
    // Clear token and user data
    this.authService.clearToken();
    // Navigate to signin page
    this.router.navigate(['/signin']);
  }
}
