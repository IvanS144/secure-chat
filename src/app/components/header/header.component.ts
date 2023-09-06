import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router, private authService: AuthService){}

  logout(){
    localStorage.removeItem("user")
    this.authService.logout().subscribe({
      error: (err: HttpErrorResponse) => console.log(err)
    })
    this.router.navigate([''])

  }

  isUserLoggedIn(): boolean{
    return localStorage.getItem("user")!=null
  }

}
