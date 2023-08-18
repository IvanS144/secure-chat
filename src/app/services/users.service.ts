import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../model/user-dto';
import { Observable } from 'rxjs';
import { baseUrl } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getOnlineUsers(): Observable<UserDTO[]>{
    return this.http.get<UserDTO[]>(`${baseUrl}/users`, {"withCredentials": true})
  }

  getById(userId: number): Observable<UserDTO>{
    return this.http.get<UserDTO>(`${baseUrl}/users/${userId}`, {"withCredentials": true})
  }
}
