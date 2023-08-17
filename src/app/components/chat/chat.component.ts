import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageDTO } from 'src/app/model/message-dto';
import { UserDTO } from 'src/app/model/user-dto';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  constructor(private messagesService: MessagesService, private route: ActivatedRoute, private formBuilder: FormBuilder){}
  private routeSubscription: Subscription | null = null
  messages : MessageDTO[] =[]
  messageForm: FormGroup = this.formBuilder.group({
    "senderId": null,
    "recipientId": null,
    "content": ['']
  })
  contact: number = 0
  private user: UserDTO | null = null

  ngOnInit(){
    let userJSON = localStorage.getItem("user")
    if(userJSON){
      this.user = JSON.parse(userJSON)
    }
    if(this.user){
    // ! problem: cuvanje prethodnih poruka iz sesije u session storage
    this.routeSubscription = this.route.params.subscribe(params =>{
      this.contact = parseInt(params['id'])
      let messagesJSON = localStorage.getItem(`chat-${this.contact}`)
      if(messagesJSON){
        this.messages = JSON.parse(messagesJSON)
      }
      this.getMessages()
    })
  }
  }

  ngOnDestroy(){
    this.routeSubscription?.unsubscribe()
    if(this.contact>0)
    localStorage.setItem(`chat-${this.contact}`, JSON.stringify(this.messages))
  }

  sendMessage(){
    this.messageForm.patchValue({"senderId": this.user?.userId, "recipientId": this.contact})
    this.messagesService.sendMessage(this.messageForm.value)
    .subscribe({
      next: _ => {
        this.messages.push(this.messageForm.value)
        this.resetForm()
      },
      error: (err: HttpErrorResponse) => console.log(err)
    })
  }

  resetForm(){
    this.messageForm.reset()
  }

  getMessages(){
    this.messagesService.getMessagesBySenderIdAndRecipientId(this.contact, this.user?.userId || 0)
      .subscribe({
        next: (messages: MessageDTO[]) => {
          for(let message of messages){
            let found = this.messages.some(oldMessage => oldMessage.messageId === message.messageId)
            if(found == false)
            this.messages.push(message)
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      })
  }


}
