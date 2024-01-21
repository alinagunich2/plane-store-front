import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponseType } from 'src/types/default-response.type';
import { OrderType } from 'src/types/order.type';
import { UserInfoType } from 'src/types/user-info.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }


  updateUserInfo(params:UserInfoType):Observable< DefaultResponseType>{
    return this.http.post< DefaultResponseType>('http://localhost:3000/api/'+'user',params)
  }

  getUserInfo():Observable<UserInfoType| DefaultResponseType>{
    return this.http.get<UserInfoType| DefaultResponseType>('http://localhost:3000/api/'+'user')
  }
}
