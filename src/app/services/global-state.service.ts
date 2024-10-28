import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model'; // Importa la interfaz User

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private userSubject: BehaviorSubject<User | null>;

  // Observable para suscribirse al usuario actual
  user$: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.userSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.user$ = this.userSubject.asObservable();
  }

  // Método para establecer el usuario
  setUser(user: User): void {
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userSubject.next(user);
  }

  // Método para obtener el usuario actual
  getUser(): User | null {
    return this.userSubject.value;
  }

  // Método para limpiar el usuario (por ejemplo, al cerrar sesión)
  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  updateUserCapital(newCapital: number): void {
    const user = this.getUser();
    if (user) {
      user.investment_capital = newCapital;
      this.setUser(user);
    }
  }
}
