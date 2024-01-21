import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavoriteType } from 'src/types/favorite.type';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http:HttpClient) { }

  getFavorites():Observable<FavoriteType[]|DefaultResponseType>{
    return this.http.get<FavoriteType[]|DefaultResponseType>('http://localhost:3000/api/'+'favorites')
  }
  removeFavorites(productId:string):Observable<DefaultResponseType>{
    return this.http.delete<DefaultResponseType>('http://localhost:3000/api/'+'favorites',{
    body:{productId}
    })
  }
  addFavorites(productId:string):Observable<FavoriteType|DefaultResponseType>{
    return this.http.post<FavoriteType|DefaultResponseType>('http://localhost:3000/api/'+'favorites',{productId})
  }
}
