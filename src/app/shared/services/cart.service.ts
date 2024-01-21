import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public count:number=0
  count$:Subject<number>=new Subject<number>()

  constructor(private http:HttpClient) { }




  getCart():Observable<CartType | DefaultResponseType>{
    return this.http.get<CartType | DefaultResponseType>('http://localhost:3000/api/'+'cart',{withCredentials:true})
  }
  getCartCount():Observable<{count:number} | DefaultResponseType>{
    return this.http.get<{count:number} | DefaultResponseType>('http://localhost:3000/api/'+'cart/count',{withCredentials:true})
    .pipe(
      tap(data=>{
        if(!data.hasOwnProperty('error')){
          this.count=(data as {count:number}).count
        this.count$.next( this.count)
        }
      })
    )
  }
  updateCart(productId:string,quantity:number):Observable<CartType | DefaultResponseType>{
    return this.http.post<CartType | DefaultResponseType>('http://localhost:3000/api/'+'cart',{
      productId,
      quantity
    },{withCredentials:true})
    .pipe(
      tap(data=>{
        if(!data.hasOwnProperty('error')){
          this.count=0;
          (data as CartType).items.forEach(item=>{
            this.count+=item.quantity
            this.count$.next( this.count)
  
          })
        }
       
      })
    )
  }
}
