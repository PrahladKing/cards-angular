import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firestoreService = inject(FirestoreService);
  private readonly USERS_COLLECTION = 'users';
  
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

  // firestore user sign up
  async signUp(user: User): Promise<string> {
    const userId = await this.firestoreService.add(this.USERS_COLLECTION, user);
    return userId;
  }

  async getUserList(): Promise<User[]> {
    const users = await this.firestoreService.getAll(this.USERS_COLLECTION) as User[];
    return users;
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.firestoreService.getById(this.USERS_COLLECTION, userId) as User;
    return user;
  }

  async updateUser(userId: string, user: Partial<User>): Promise<void> {
    await this.firestoreService.update(this.USERS_COLLECTION, userId, user);
  }

  async isUserExists(username: string): Promise<boolean> {
    const users = await this.firestoreService.queryByField(this.USERS_COLLECTION, 'username', username) as User[];
    return users.length > 0;
  }

  async login(username: string, password: string): Promise<User | null> {
    const users = await this.firestoreService.queryByField(this.USERS_COLLECTION, 'username', username) as User[];
    if (users.length === 0) {
      return null;
    }
    
    // Find the user with matching password
    const user = users.find(u => u.password === password);
    if (!user) {
      return null;
    }
    
    if (user.username === 'prahlad_king') {
      this.setIsAdmin();
    }
    this.token = user.id || '';
    return user;
  }
}

export interface User {
  id?: string;
  mobile: string;
  username: string;
  name: string;
  password: string;
}
