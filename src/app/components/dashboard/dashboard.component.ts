import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/model/user-dto';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private usersService: UsersService, private router: Router, private formBuilder: FormBuilder){}

  users: UserDTO[] = []
  searchForm: FormGroup = this.formBuilder.group({
    "userName": ['']
  })
  private user: UserDTO | null = null

  ngOnInit(){
    let json = localStorage.getItem("user")
    if(json!=null){
      this.user = JSON.parse(json)
    }
    this.getUsers()
  }

  getUsers(){
    this.usersService.getOnlineUsers()
    .subscribe({
      next: (users: UserDTO[]) =>{
        this.users = users.filter((u: UserDTO) => u.userId!=this.user?.userId)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        if(err.status==401 || err.status==403)
        this.router.navigate([''])
      }
    })
  }

}
