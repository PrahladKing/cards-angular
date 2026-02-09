import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  private fb = inject(FormBuilder);

  errorMessage = signal<string>('');

  signinForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.signinForm.invalid) {
      this.errorMessage.set('Invalid username or password');
      return;
    }

    this.errorMessage.set('');

    const formData = {
      username: this.signinForm.value.username,
      password: this.signinForm.value.password,
    };
    console.log('Signin form data:', formData);
  }
}
