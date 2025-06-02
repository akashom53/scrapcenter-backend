import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';

export interface User {
  id: number;
  email: string;
  name: string | null;
  isAdmin: boolean;
  isApproved: boolean;
}

export interface UserUpdateData {
  name?: string;
  isAdmin?: boolean;
  isApproved?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiService: ApiService) { }

  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(`/users`);
  }

  updateUser(userId: number, updateData: UserUpdateData): Observable<User> {
    return this.apiService.patch<User>(`/users/${userId}`, updateData);
  }
}
