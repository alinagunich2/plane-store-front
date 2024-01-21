import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { ProductType } from 'src/types/product.type';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent  implements OnInit{

  extraProducts:ProductType[]=[]
  cart:CartType|null=null
  totalAmount:number=0;
  totalCount:number=0;

  constructor(private productServise:ProductService,
    private cartServise:CartService
    
    ){

  }

  ngOnInit(): void {
    this.productServise.getBestProducts()
    .subscribe((data:ProductType[])=>{
      this.extraProducts = data
    })


    this.cartServise.getCart()
    .subscribe((data:CartType | DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }

      this.cart=data as CartType
      this.calculateTotal()
    })
  }

  calculateTotal(){
    this.totalAmount = 0
    this.totalCount = 0
    if(this.cart){
      this.cart.items.forEach(item=>{
        this.totalAmount+=item.quantity*item.product.price
        this.totalCount+=item.quantity
      })
    }
}

updateCount(id:string,count:number){
  if(this.cart){
    this.cartServise.updateCart(id,count)
    .subscribe((data:CartType | DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }

      this.cart = data as CartType
      this.calculateTotal()
    })
  }
}




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



}
