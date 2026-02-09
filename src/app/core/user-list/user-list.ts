import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private router = inject(Router);

  navigateToAddUser(): void {
    this.router.navigate(['/admin/add-user']);
  }
}
