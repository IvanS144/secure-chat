import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageDTO } from '../model/message-dto';
import { baseUrl } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) { }

  getMessagesByRecipientId(recipientId: number): Observable<MessageDTO[]>{
    return this.http.get<MessageDTO[]>(`${baseUrl}/messages/${recipientId}`, {"withCredentials": true})
  }

  getMessagesBySenderIdAndRecipientId(senderId: number, recipientId:number): Observable<MessageDTO[]>{
    return this.http.get<MessageDTO[]>(`${baseUrl}/messages/${recipientId}?senderId=${senderId}`, {"withCredentials": true})
  }

  sendMessage(message: MessageDTO): Observable<any>{
    return this.http.post(`${baseUrl}/messages`, message, {"withCredentials": true})
  }
}
