import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavoriteType } from 'src/types/favorite.type';
import { ProductType } from 'src/types/product.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit{
  countdet:number = 1
  recommendedProducts:ProductType[]=[]
  product!:ProductType
  
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 24,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor(private productService:ProductService,
    private activateRoute:ActivatedRoute,
    private cartService: CartService,
    private favoriteService:FavoriteService,
    private authService:AuthService,
    private _snackBar:MatSnackBar){}

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params=>{
      this.productService.getProduct(params['url'])
      .subscribe((data:ProductType)=>{
        this.product=data

        this.cartService.getCart()
        .subscribe((cartData:CartType|DefaultResponseType)=>{
          if((cartData as DefaultResponseType).error!==undefined){
            const error =(cartData as DefaultResponseType).message
            throw new Error(error)
          }
          
          const cartDataResponse=cartData as CartType
          if(cartDataResponse){
            const productInCart = cartDataResponse.items.find(item=>item.product.id===data.id)

            if(productInCart){
              this.product.countInCart=productInCart.quantity
              this.countdet =this.product.countInCart
            }
          }

          if(!this.authService.getIsLoggedIn()){
          this.favoriteService.getFavorites()
          .subscribe((data:FavoriteType[]|DefaultResponseType)=>{
            if((data as DefaultResponseType).error!==undefined){
              const error =(data as DefaultResponseType).message
              throw new Error(error)
            }
      
            const products=data as FavoriteType[]
            const currrentProductExist = products.find(item=>item.id===this.product.id)
            if(currrentProductExist){
              this.product.isInFavorite=true
           }
          })
        }
        })
      
      })
    })

    this.productService.getBestProducts()
    .subscribe((data:ProductType[])=>{
      this.recommendedProducts = data
    })
  }

  updateCount(value:number){

    this.countdet=value
    if(this.product.countInCart){
      this.cartService.updateCart(this.product.id, this.countdet)
    .subscribe((data:CartType|DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }
      this.product.countInCart=this.countdet
    })
    }
  }

  addToCart(){
    this.cartService.updateCart(this.product.id, this.countdet)
    .subscribe((data:CartType|DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }
      this.product.countInCart=this.countdet
    })
  }
  removeFromCart(){
    this.cartService.updateCart(this.product.id, 0)
    .subscribe((data:CartType|DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }
      this.product.countInCart=0
      this.countdet=1
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
}
