import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedValue: boolean = false;
  private bearerToken: string = '';

  constructor() {
    // Retrieve authentication state and token from localStorage on service 
    this.isAuthenticatedValue = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
    this.bearerToken = localStorage.getItem('bearerToken') || '';
  }

  signOut(): void {
    // Clear localStorage on sign out
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('bearerToken');

    this.setBearerToken('');
    this.setAuthenticated(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedValue;
  }

  setAuthenticated(status: boolean): void {
    this.isAuthenticatedValue = status;

    // Store authentication state in localStorage
    localStorage.setItem('isAuthenticated', JSON.stringify(status));
  }

  setBearerToken(token: string): void {
    this.bearerToken = token;

    // Store bearer token in localStorage
    localStorage.setItem('bearerToken', token);
  }

  getBearerToken(): string {
    return this.bearerToken;
  }
  handleAuthentication(token: string): void {
    // Set token in AuthService
    this.setBearerToken(token);
    this.setAuthenticated(true);
  }
  
}
