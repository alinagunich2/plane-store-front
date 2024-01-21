import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryWithType } from 'src/types/category-with-type.type';
import { CategoryType } from 'src/types/category.type';
import { TypeType } from 'src/types/type.type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }


  getCategories():Observable<CategoryType[]>{
    return this.http.get<CategoryType[]>('http://localhost:3000/api/'+'categories')
  }

  getCategoriesWhithType():Observable<CategoryWithType[]>{
    return this.http.get<TypeType[]>('http://localhost:3000/api/'+'types')
    .pipe(
     
      map((items:TypeType[])=>{
   
        const array:CategoryWithType[]=[]

        items.forEach((item:TypeType)=>{

          const foundItem = array.find((arrayItem)=>{
          return  arrayItem.url === item.category.url
          })
          
          if(foundItem){
            foundItem.types.push({
              id: item.id,
              name: item.name,
              url:item.url
            })
          }else{
            array.push({
              id: item.category.id,
              name: item.category.name,
              url:item.category.url,
              types:[
                { 
                id: item.id,
                name: item.name,
                url:item.url
                }]
            })
          }
        })
        return array
      })
    )
  }
}
