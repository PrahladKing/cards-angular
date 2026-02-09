import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-signin.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  signinForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit(): Promise<void> {
    if (this.signinForm.invalid) {
      this.errorMessage.set('Invalid username or password');
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const username = this.signinForm.value.username || '';
    const password = this.signinForm.value.password || '';

    try {
      const user = await this.authService.login(username, password);
      
      if (user) {
        // Token is already set in login method, navigate to admin
        this.router.navigate(['/admin']);
      } else {
        this.errorMessage.set('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage.set('Failed to sign in. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
