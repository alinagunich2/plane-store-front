import { CartService } from 'src/app/shared/services/cart.service';
import { Component, Input, OnInit } from '@angular/core';
import { ProductType } from 'src/types/product.type';
import { CartType } from 'src/types/cart.type';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavoriteType } from 'src/types/favorite.type';
import { Router } from '@angular/router';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit{

  constructor(private cartService:CartService,
    private favoriteService:FavoriteService,
    private authService:AuthService,
    private _snackBar:MatSnackBar,
    private router:Router){}

  @Input() product!:ProductType
  @Input() isLight: boolean = false
  count:number =1
  @Input() countInCart:number|undefined = 0
  
  isLoggedIn:boolean = this.authService.getIsLoggedIn()



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
  updateFavorite(){
    if(!this.authService.getIsLoggedIn()){
      this._snackBar.open('Для добавлен в избр над авторизоваться')
      return
    }

    if(this.product.isInFavorite){

        this.favoriteService.removeFavorites(this.product.id)
        .subscribe((data:DefaultResponseType)=>{
          if(data.error){
    
            throw new Error(data.message)
          }
          this.product.isInFavorite=false
        
        })

    }else{
      this.favoriteService.addFavorites(this.product.id)
      .subscribe((data:FavoriteType|DefaultResponseType)=>{
        if((data as DefaultResponseType).error!==undefined){
          throw new Error((data as DefaultResponseType).message)
        }
  
        this.product.isInFavorite = true
  
      })
    }

   
  }

  navigate(){
    if(this.isLight){
      this.router.navigate(['/product/'+this.product.url])
    }
  }
}
