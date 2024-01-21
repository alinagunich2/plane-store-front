import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { CartService } from '../../services/cart.service';
import { FavoriteType } from 'src/types/favorite.type';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Component({
  selector: 'app-favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrls: ['./favorite-card.component.scss']
})
export class FavoriteCardComponent implements OnInit{

  @Input() product!:FavoriteType
  count:number =1
  @Input() countInCart:number|undefined = 0



  @Output() onCountChange:EventEmitter<string> = new EventEmitter<string>()

  remove():void{
    this.onCountChange.emit(this.product.id)
  }

  constructor(private favoriteService:FavoriteService,
    private cartService:CartService){}

  ngOnInit(): void {
      if(this.countInCart&&this.countInCart>1){
      this.count=this.countInCart
   
    }
   
  }


    addToCart(){
    this.cartService.updateCart(this.product.id, this.count)
    .subscribe((data:CartType|DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }

      this.countInCart=this.count
    })
  }

  updateCount(value:number){
    this.count=value
    if(this.countInCart){
      this.cartService.updateCart(this.product.id, this.count)
    .subscribe((data:CartType|DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }
      this.countInCart=this.count
    })
    }
    
  }

    removeFromCart(){
    this.cartService.updateCart(this.product.id, 0)
    .subscribe((data:CartType|DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }

      this.countInCart=0
      this.count=1
    })
  }


}
