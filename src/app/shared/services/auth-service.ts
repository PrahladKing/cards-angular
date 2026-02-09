import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
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


}
