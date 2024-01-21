import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from './../../../shared/services/category.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { CategoryWithType } from 'src/types/category-with-type.type';
import { ProductType } from 'src/types/product.type';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { ActiveParamsType } from 'src/types/active-params.type';
import { AppliedFilterType } from 'src/types/applied-filter.type';
import { debounceTime } from 'rxjs';
import { CartService } from 'src/app/shared/services/cart.service';
import { CartType } from 'src/types/cart.type';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { FavoriteType } from 'src/types/favorite.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit{
  products:ProductType[]=[]
  categoriesWithTypes:CategoryWithType[]=[]
  favoriteProducts:FavoriteType[]|null=[]

  activeParams:ActiveParamsType={types:[]}
  appliedFilters:AppliedFilterType[]=[]

  sortingOpen = false
  sortingOptions:{name:string,value:string}[]=[
    {name:'От А до Я', value:'az-asc'},
    {name:'От Я до А', value:'az-desc'},
    {name:'По возрастанию цены', value:'price-asc'},
    {name:'По убыванию цены', value:'price-desc'},
  ]
  pages:number[]=[]
  cart:CartType|null=null


  constructor(private productService:ProductService,
    private categoryService:CategoryService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private cartServise:CartService,
    private favoriteService:FavoriteService,
    private authService:AuthService){
     
    }

  ngOnInit(): void {

    this.cartServise.getCart()
    .subscribe((data:CartType |DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }

      this.cart=data as CartType

      if(this.authService.getIsLoggedIn()){
        this.favoriteService.getFavorites()
      .subscribe({
        next:(data:FavoriteType[]|DefaultResponseType)=>{
          if((data as DefaultResponseType).error!==undefined){
            const error =(data as DefaultResponseType).message
            this.processCatalog()
            throw new Error(error)
          }
          this.favoriteProducts = data as FavoriteType[]
          this.processCatalog()

        },
        error:(error)=>{
          this.processCatalog()
        }
      })
      }else{
        this.processCatalog()
      }

      
    })
  }

  processCatalog(){
    this.categoryService.getCategoriesWhithType()
    .subscribe(data=>{
      this.categoriesWithTypes=data

      this.activatedRoute.queryParams
      .pipe(
        debounceTime(500)
      )
      .subscribe(params=>{
        this.activeParams=ActiveParamsUtil.processParam(params)
   
        this.appliedFilters=[]
        this.activeParams.types.forEach(url=>{
          for(let i = 0; i<this.categoriesWithTypes.length;i++){
            const foundType= this.categoriesWithTypes[i].types.find(type=>type.url===url)
            if(foundType){
              this.appliedFilters.push({
                name: foundType.name,
                urlParam: foundType.url
              })
            }
          
          }
        })
        if(this.activeParams.heightFrom){
          this.appliedFilters.push({
            name:'Высота: от '+this.activeParams.heightFrom+' см',
            urlParam:'heightFrom'
          })
        }
        if(this.activeParams.heightTo){
          this.appliedFilters.push({
            name:'Высота: до '+this.activeParams.heightTo+' см',
            urlParam:'heightTo'
          })
        }
        if(this.activeParams.diameterFrom){
          this.appliedFilters.push({
            name:'Диаметр: от '+this.activeParams.diameterFrom+' см',
            urlParam:'diameterFrom'
          })
        }
        if(this.activeParams.diameterTo){
          this.appliedFilters.push({
            name:'Диаметр: до '+this.activeParams.diameterTo+' см',
            urlParam:'diameterTo'
          })
        }

        this.productService.getProducts(this.activeParams)
        .subscribe(data=>{
         
          this.pages=[]
          for(let i =1;i<=data.pages;i++){
            this.pages.push(i)
          }

          if(this.cart&&this.cart.items.length>0){
            this.products=data.items.map(product=>{
              const productInCart = this.cart?.items.find(item=>{
                return item.product.id===product.id
              })
              if(productInCart){
                product.countInCart=productInCart.quantity
              }

              return product
            })
          }else{
            this.products=data.items
          }

          if(this.favoriteProducts){
            this.products = this.products.map(product=>{
              const productInFavorite = this.favoriteProducts?.find(item=>item.id===product.id)
              if(productInFavorite){
                product.isInFavorite=true
              }
              return product
            })
          }
        })

      })
      
    })
  }

  removeAppliedFilter(appliedFilter:AppliedFilterType){
    if(appliedFilter.urlParam==='heightTo' || appliedFilter.urlParam==='heightFrom' || appliedFilter.urlParam==='diameterTo' || appliedFilter.urlParam==='diameterFrom' ){
      delete this.activeParams[appliedFilter.urlParam]
    }else{
      this.activeParams.types = this.activeParams.types.filter(item=>item!==appliedFilter.urlParam)
    }
    this.activeParams.page=1
    this.router.navigate(['/catalog'],{
      queryParams:this.activeParams
    })
  }

  toggleSorting(){
    this.sortingOpen=!this.sortingOpen
  }

  sort(value:string):void{
    this.activeParams.sort=value

    this.router.navigate(['/catalog'],{
      queryParams:this.activeParams
    })
  }

  openPage(page:number):void{
    this.activeParams.page=page

    this.router.navigate(['/catalog'],{
      queryParams:this.activeParams
    })
    
  }
  
  openPrevPage(){
    if(this.activeParams.page&&this.activeParams.page>1){
      this.activeParams.page--
      this.router.navigate(['/catalog'],{
      queryParams:this.activeParams
    })
    }
  }
  openNextPage(){
    if(this.activeParams.page&&this.activeParams.page<this.pages.length){
      this.activeParams.page++
      this.router.navigate(['/catalog'],{
      queryParams:this.activeParams
    })
    }
  }

  
}
