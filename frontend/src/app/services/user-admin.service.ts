import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  civility?: 'Mr' | 'Mme';
  createdAt?: Date;
}

export interface UsersResponse {
  admins: AdminUser[];
  users: AdminUser[];
  total: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  civility?: 'Mr' | 'Mme';
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  civility?: 'Mr' | 'Mme';
}

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  private apiUrl = `${environment.apiUrl}/users/admin`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/all`);
  }

  // Créer un nouvel utilisateur
  createUser(userData: CreateUserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, userData);
  }

  // Mettre à jour un utilisateur
  updateUser(userId: string, userData: UpdateUserRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  // Mettre à jour le rôle d'un utilisateur
  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/role`, { role });
  }
}
