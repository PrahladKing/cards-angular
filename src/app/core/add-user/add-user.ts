import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser {
  private fb = inject(FormBuilder);

  userForm = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(/^[6-9]{10}$/)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const formData = {
      mobile: this.userForm.value.mobile,
      username: this.userForm.value.username,
      name: this.userForm.value.name,
      password: this.userForm.value.password,
    };
    console.log('User form data:', formData);
  }
}
