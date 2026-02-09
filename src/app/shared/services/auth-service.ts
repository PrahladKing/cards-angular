import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseService = inject(FirebaseService);
  
  isAuthenticated(): boolean {
    if (this.token) {
      return true;
    }
    return false;
  }

  // Local storage
  set token(token: string) {
    localStorage.setItem('c-token', token);
  }

  get token(): string {
    return localStorage.getItem("c-token") ?? "";
  }

  clearToken() {
    localStorage.removeItem('c-token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('is-admin') === 'true';
  }

  clearIsAdmin() {
    localStorage.removeItem('is-admin');
  }

  setIsAdmin() {
    localStorage.setItem('is-admin', 'true');
  }

  // firebase user sign up
  async signUp(user: User): Promise<string> {
    const idRef = this.firebaseService.push('users', user);
    const userId = idRef.key || '';
    if (userId) {
      await this.firebaseService.update(`users/${userId}`, { id: userId });
    }
    return userId;
  }

  async getUserList(): Promise<User[]> {
    const usersObj = await this.firebaseService.get('users') as Record<string, User> | null;
    if (!usersObj) {
      return [];
    }
    return Object.keys(usersObj).map(key => ({
      ...usersObj[key],
      id: key
    }));
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.firebaseService.get(`users/${userId}`);
    return user as User;
  }

  async updateUser(userId: string, user: User): Promise<void> {
    await this.firebaseService.update(`users/${userId}`, user);
  }
}

export interface User {
  id?: string;
  mobile: string;
  username: string;
  name: string;
  password: string;
}
