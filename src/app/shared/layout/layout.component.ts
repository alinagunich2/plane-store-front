import { Component, OnInit } from '@angular/core';
import { CategoryType } from 'src/types/category.type';
import { CategoryService } from '../services/category.service';
import { CategoryWithType } from 'src/types/category-with-type.type';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit{

  categories:CategoryWithType[]=[]

  constructor(private categoryService:CategoryService){}

  ngOnInit(): void {
    this.categoryService.getCategoriesWhithType()
      .subscribe((categories:CategoryWithType[])=>{
        this.categories=categories.map(item=>{
          return Object.assign({typesUrl:item.types.map(itm=>itm.url)},item)
        
        
        })
      })
  }

}
