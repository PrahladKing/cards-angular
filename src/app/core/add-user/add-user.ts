import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../../shared/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);


  userForm = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.errorMessage.set('Invalid form data');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData: User = {
      mobile: this.userForm.value.mobile ?? '',
      username: this.userForm.value.username ?? '',
      name: this.userForm.value.name ?? '',
      password: this.userForm.value.password ?? '',
    };
    this.authService.signUp(formData).then((userId) => {
      this.isLoading.set(false);
      this.router.navigate(['/admin/users']);
    }).catch((error) => {
      this.isLoading.set(false);
      this.errorMessage.set('Failed to add user');
      console.error('Error adding user:', error);
    });
  }
}
