import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { notEmptyNotBlankRegex } from 'src/app/app.module';
import { UserDTO } from 'src/app/model/user-dto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private snackBar: MatSnackBar){}

  form: FormGroup = this.formBuilder.group({
    "userName": [null, [Validators.required, Validators.pattern(notEmptyNotBlankRegex)]],
    "password": [null, [Validators.required, Validators.pattern(notEmptyNotBlankRegex)]]
  })

  get userName(){
    return this.form.get('userName')
  }

  get password(){
    return this.form.get('password')
  }

  login(){
    this.authService.login(this.form.value)
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
    let password: string = this.form.get('password')?.value
    if(password.length<16){
      this.snackBar.open("Password must contain 16 characters", "OK", { "duration": 5000})
      return
    }
    this.authService.register(this.form.value)
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
