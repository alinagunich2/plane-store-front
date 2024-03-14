import { LoaderComponent } from './../../components/loader/loader.component';
import { CartService } from 'src/app/shared/services/cart.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryWithType } from 'src/types/category-with-type.type';
import { CategoryType } from 'src/types/category.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ProductService } from '../../services/product.service';
import { ProductType } from 'src/types/product.type';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { LoaderService } from '../../services/loager.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  searchField = new FormControl()

  isLoged:boolean = false
  count:number=0
  products:ProductType[]=[]
  shoredSearch:boolean = false

  // searchValue:string = ''

  @Input() categories:CategoryWithType[]=[]

  constructor(private authServise:AuthService,
    private _snackBar:MatSnackBar,
    private router:Router,
    private cartService:CartService,
    private productService:ProductService,

    ){
    this.isLoged = this.authServise.getIsLoggedIn()
  }

 ngOnInit(): void {





  this.searchField.valueChanges
  .pipe(
    debounceTime(500)
  )
  .subscribe(value=>{
    if(value && value.length>2){
          this.productService.searchProducts(value)
            .subscribe((data:ProductType[])=>{
              this.products=data
              this.shoredSearch = true
            })
        }else{
          this.products=[]
        }
  })



   this.authServise.isLogged$.subscribe((isLoggedIn:boolean)=>{
    this.isLoged = isLoggedIn
   })

   this.cartService.getCartCount()
   .subscribe((data:{count:number} | DefaultResponseType)=>{
    if((data as DefaultResponseType).error!==undefined){
      const error =(data as DefaultResponseType).message
      throw new Error(error)
    }
    this.count=(data as {count:number} ).count

  
   });

   this.cartService.count$
   .subscribe(count=>{
    this.count=count
   })
 }
 logout():void{
    this.authServise.logout()
    .subscribe({
      next:(data:DefaultResponseType)=>{
        this.doLoggout()

      },
      error:(errResponse:HttpErrorResponse)=>{
      this.doLoggout()
      }
    })
 }

 doLoggout():void{
  this.authServise.removeTokens()
  this.authServise.userId = null
  this._snackBar.open('Вы вышли из системы')
  this.router.navigate(['/'])
 }

//  cahangeSearchValue(newValue:string){
//   this.searchValue= newValue

//   if(this.searchValue && this.searchValue.length>2){
//     this.productService.searchProducts(this.searchValue)
//       .subscribe((data:ProductType[])=>{
//         this.products=data
//         this.shoredSearch = true
//       })
//   }else{
//     this.products=[]
//   }
  

//  }

 selectProduct(url:string){
  this.router.navigate(['/product/'+url]);
  // this.searchValue='';
  this.searchField.setValue('')
  this.products=[]
 }

//  changeshoredSearch(value:boolean){
//   setTimeout(()=>{
//     this.shoredSearch= value
//   },100)
//  }

@HostListener('document:click',['$event'])
click(event:Event){
  if(this.shoredSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1){
    this.shoredSearch = false
  }
}


}
