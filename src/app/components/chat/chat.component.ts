import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { notEmptyNotBlankRegex } from 'src/app/app.module';
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
  constructor(private messagesService: MessagesService, private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private usersService: UsersService){}
  private routeSubscription: Subscription | null = null
  messages : MessageDTO[] =[]
  messageForm: FormGroup = this.formBuilder.group({
    "senderId": null,
    "recipientId": null,
    "content": ['', [Validators.required, Validators.pattern(notEmptyNotBlankRegex)]]
  })
  contactId: number = 0
  user: UserDTO | null = null
  contact: UserDTO | null = null
  private intervalID : number | null = null

  get content(){
    return this.messageForm.get('content')
  }

  ngOnInit(){
    let userJSON = localStorage.getItem("user")
    if(userJSON){
      this.user = JSON.parse(userJSON)
    }
    if(this.user){
    // ! problem: cuvanje prethodnih poruka iz sesije u session storage
    this.routeSubscription = this.route.params.subscribe(params =>{
      this.contactId = parseInt(params['id'])
      this.usersService.getById(this.contactId)
      .subscribe({
        next: (user: UserDTO) => this.contact = user,
        error: (err: HttpErrorResponse) => console.log(err)
      })
      let messagesJSON = localStorage.getItem(`chat-${this.user?.userId}-${this.contactId}`)
      if(messagesJSON){
        this.messages = JSON.parse(messagesJSON)
      }
      this.getMessages()
      this.intervalID = window.setInterval(() => this.getMessages(), 2000);
    })
  }
  }

  ngOnDestroy(){
    this.routeSubscription?.unsubscribe()
    if(this.intervalID)
    window.clearInterval(this.intervalID)
    if(this.contactId>0)
    localStorage.setItem(`chat-${this.user?.userId}-${this.contactId}`, JSON.stringify(this.messages))
  }

  sendMessage(){
    this.messageForm.patchValue({"senderId": this.user?.userId, "recipientId": this.contactId})
    this.messagesService.sendMessage(this.messageForm.value)
    .subscribe({
      next: _ => {
        this.messages.push(this.messageForm.value)
        localStorage.setItem(`chat-${this.user?.userId}-${this.contactId}`, JSON.stringify(this.messages))
        this.resetForm()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        if(err.status==401)
        this.router.navigate([''])
      }
    })
  }

  resetForm(){
    this.messageForm.reset()
  }

  getMessages(){
    this.messagesService.getMessagesBySenderIdAndRecipientId(this.contactId, this.user?.userId || 0)
      .subscribe({
        next: (messages: MessageDTO[]) => {
          for(let message of messages){
            let found = this.messages.some(oldMessage => oldMessage.messageId === message.messageId)
            console.log(found)
            if(found == false)
            this.messages.push(message)
          }
          localStorage.setItem(`chat-${this.user?.userId}-${this.contactId}`, JSON.stringify(this.messages))
        },
        error: (err: HttpErrorResponse) => {
        console.log(err)
        if(err.status==401 || err.status==403)
        this.router.navigate([''])
      }
      })
  }
}
