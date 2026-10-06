import { Injectable, signal, computed, inject } from '@angular/core';
import { User, AuthResponse } from '../models/user.model';
import { ApiService } from './api.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  constructor() {
    const savedUser = localStorage.getItem('arise_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: any) {
    return this.api.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(res => this.setAuth(res))
    );
  }

  register(data: any) {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap(res => this.setAuth(res))
    );
  }

  logout() {
    localStorage.removeItem('arise_token');
    localStorage.removeItem('arise_refresh_token');
    localStorage.removeItem('arise_user');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setAuth(res: AuthResponse) {
    localStorage.setItem('arise_token', res.accessToken);
    localStorage.setItem('arise_refresh_token', res.refreshToken);
    localStorage.setItem('arise_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  getToken(): string | null {
    return localStorage.getItem('arise_token');
  }
}
