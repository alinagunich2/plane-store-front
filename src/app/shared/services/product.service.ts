import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ProductType } from 'src/types/product.type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http:HttpClient) { }
  getBestProducts():Observable<ProductType[]>{
    return this.http.get<ProductType[]>('http://localhost:3000/api/'+'products/best')
  }
  getProducts(params:ActiveParamsType):Observable<{totalCount:number, pages:number, items: ProductType[]}>{
    return this.http.get<{totalCount:number, pages:number, items: ProductType[]}>('http://localhost:3000/api/'+'products',{
      params:params
    })
  }
  getProduct(url:string):Observable<ProductType>{
    return this.http.get<ProductType>('http://localhost:3000/api/'+'products/'+url)
  }

  searchProducts(query:string):Observable<ProductType[]>{
    return this.http.get<ProductType[]>('http://localhost:3000/api/'+'products/search?query='+query)
  }
}
