import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm=this.fb.group({
    email:['',[Validators.email,Validators.required]],
    password:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    passwordRepeat:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    rememberMe:[false,Validators.requiredTrue]
  })
  constructor(private fb:FormBuilder,
    private authServise:AuthService,
    private _snackBar: MatSnackBar,
    private router:Router){

  }



  signup(){
    if(this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.passwordRepeat && this.signupForm.value.rememberMe){
      this.authServise.signup(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.passwordRepeat )
      .subscribe({
        next:(data:DefaultResponseType|LoginResponseType)=>{
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

          this._snackBar.open('Вы успешно регистрации')
          this.router.navigate(['/'])
        },
        error:(errorResponse:HttpErrorResponse)=>{
          if(errorResponse.error && errorResponse.error.message){
            this._snackBar.open(errorResponse.error.message)
          }else{
            this._snackBar.open('Ошибка регистрации')
          }
        }
      })
    }
  }

}
