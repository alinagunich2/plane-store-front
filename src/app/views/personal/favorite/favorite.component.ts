import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavoriteType } from 'src/types/favorite.type';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit{
  products:FavoriteType[]=[]
  productss:FavoriteType[]=[]
  count:number =1
  cart:CartType|null =null
  inCard:boolean = false

  buttons = new Subject<boolean>()

  constructor(private favoriteService:FavoriteService,
    private cartService:CartService,
    private router:Router){}

  ngOnInit(): void {
    this.favoriteService.getFavorites()
    .subscribe((data:FavoriteType[]|DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }

      this.products=data as FavoriteType[]
     


      this.cartService.getCart()
      .subscribe((data:any | DefaultResponseType)=>{
        if((data as DefaultResponseType).error!==undefined){
          const error =(data as DefaultResponseType).message
          throw new Error(error)
        }
  
        this.cart=data as CartType  
        
        
        this.productss = this.products.map(itm=>{
          const productInCard = this.cart?.items.find(card=> card.product.id===itm.id)

          if(productInCard){
            itm.quantity = productInCard?.quantity
          }  
          return itm
        })  
      
      })

    })
 
  }

  updateCount(value:string){

       this.favoriteService.removeFavorites(value)
    .subscribe((data:DefaultResponseType)=>{
      if(data.error){

        throw new Error(data.message)
      }
      
      this.productss =  this.productss.filter(itm=>itm.id!==value)
    
    })
  }
}
