import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { notEmptyNotBlankRegex } from 'src/app/app.module';
import { UserDTO } from 'src/app/model/user-dto';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  constructor(private loginService: LoginService, private formBuilder: FormBuilder, private router: Router, private snackBar: MatSnackBar){}

  form: FormGroup = this.formBuilder.group({
    "userName": [null, [Validators.required]],
    "password": [null, [Validators.required]]
  })

  login(){
    this.loginService.login(this.form.value)
    .subscribe({
      next: (user: UserDTO) => {
        localStorage.setItem("user", JSON.stringify(user))
        this.router.navigate(['dashboard'])
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.snackBar.open("Login failed", "OK", { "duration": 5000})
      }
    })
  }

  register(){
    this.loginService.register(this.form.value)
    .subscribe({
      next: (user: UserDTO) => {
        localStorage.setItem("user", JSON.stringify(user))
        this.router.navigate(['dashboard'])
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.snackBar.open("Registration failed", "OK", { "duration": 5000})
      }
    })

  }

}
