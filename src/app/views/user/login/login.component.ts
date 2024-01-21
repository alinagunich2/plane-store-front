import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm=this.fb.group({
    email:['',[Validators.email,Validators.required]],
    password:['',[Validators.required]],
    rememberMe:[false]
  })

  constructor(private fb:FormBuilder,
    private authServise:AuthService,
    private _snackBar: MatSnackBar,
    private router:Router){

  }

  login():void{
    if(this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password){
      this.authServise.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
      .subscribe({
        next:(data:LoginResponseType|DefaultResponseType)=>{

          let error = null
          
          if((data as DefaultResponseType).error !== undefined){
            error = (data as DefaultResponseType).message
          }

          if(!(data as LoginResponseType).accessToken || !(data as LoginResponseType).refreshToken || !(data as LoginResponseType).userId){
            error = 'Ошибка авторизации'
          }

          if(error){
            this._snackBar.open(error)
            throw new Error(error)
          }

          //set tocen
          this.authServise.setTokens((data as LoginResponseType).accessToken,(data as LoginResponseType).refreshToken)
          this.authServise.userId = (data as LoginResponseType).userId // тут мы используем  set метод который прописан в классе authServise

          this._snackBar.open('Вы успешно авторизовались')
          this.router.navigate(['/'])
        },
        error:(errResponse:HttpErrorResponse)=>{
          if(errResponse.error && errResponse.error.message){
            this._snackBar.open(errResponse.error.message)
          }else{
            this._snackBar.open('Ошибка авторизации')
          }
        }
      })
    }
  }
}
