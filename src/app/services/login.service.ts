import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../model/login-request';
import { UserDTO } from '../model/user-dto';
import { Observable } from 'rxjs';
import { baseUrl } from '../app.module';
import { UserRequest } from '../model/user-request';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<UserDTO>{
    return this.http.post<UserDTO>(`${baseUrl}/auth/login`, loginRequest)
  }

  register(userRequest: UserRequest): Observable<UserDTO>{
    return this.http.post<UserDTO>(`${baseUrl}/register`, userRequest)
  }
}
