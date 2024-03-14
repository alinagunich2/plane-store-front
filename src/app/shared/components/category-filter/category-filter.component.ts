import { Component, Input, OnInit } from '@angular/core';
import { CategoryWithType } from 'src/types/category-with-type.type';
import { ProductType } from 'src/types/product.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ActiveParamsUtil } from '../../utils/active-params.util';

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit{

  constructor(private router:Router,
    private activatedRoute:ActivatedRoute){
     
  }


  products:ProductType[]=[]
  categoriesWithTypes:CategoryWithType[]=[]

  @Input() categoryWhisTypes:CategoryWithType|null=null;
  @Input() type: string|null=null
  open=false
  activeParams:ActiveParamsType={types:[]}

  from:number|null=null;
  to:number|null=null;
  

  get title():string{
    if(this.categoryWhisTypes){
      return this.categoryWhisTypes.name
    }else if(this.type){
      if(this.type==='height'){
        return 'Высота'
      }else if(this.type==='diameter'){
        return 'Диаметр'
      }
    }
    return ''
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params=>{

      console.log(params)

      this.activeParams=ActiveParamsUtil.processParam(params)


      
      if(this.type){
        if(this.type==='height'){
          this.open = !!(this.activeParams.heightFrom||this.activeParams.heightTo)

          if(this.activeParams.heightFrom){
            this.from = +this.activeParams.heightFrom
          }else{
            this.from = null
          }
          if(this.activeParams.heightTo){
            this.to = +this.activeParams.heightTo
          }else{
            this.to = null
          }
        }else if(this.type==='diameter'){
          this.open = !!(this.activeParams.diameterFrom||this.activeParams.diameterTo)

          if(this.activeParams.diameterFrom){
            this.from = +this.activeParams.diameterFrom
          }else{
            this.from = null
          }
          if(this.activeParams.heightTo){
            this.to = +!this.activeParams.diameterTo
          }else{
            this.to = null
          }
        }
      }else{
        if(params['types']){
          this.activeParams.types=Array.isArray(params['types']) ? params['types']: [params['types']]
        }
        

        if(this.categoryWhisTypes&&this.categoryWhisTypes.types&&this.categoryWhisTypes.types.length>0&&
          this.categoryWhisTypes.types.some(type=>{
            return this.activeParams.types.find(item=>type.url===item)
          })
          ){
                    this.open=true
        }
      }

      // console.log(params)
    })
  }

  toggle():void{
    this.open = !this.open
  }

  ubdateFilterParam(url:string,checked:boolean){

    if(this.activeParams.types&&this.activeParams.types.length>0){
      const existingTypesInParams = this.activeParams.types.find(item=>item===url)
      if(existingTypesInParams && !checked){
        this.activeParams.types=this.activeParams.types.filter(item=>item !== url)
      }else if(!existingTypesInParams && checked){
        // this.activeParams.types.push(url)
        this.activeParams.types=[...this.activeParams.types,url]
      }
    }else if(checked){
      this.activeParams.types = [url]
    }

    this.activeParams.page=1
    this.router.navigate(['/catalog'],{
      queryParams:this.activeParams
    })

  }


  ubdateFilterParamFromTo(param:string,value:string):void{

    if(param==='heightTo' || param==='heightFrom' || param==='diameterTo' || param==='diameterFrom' ){
      if(this.activeParams[param] && !value){
        delete this.activeParams[param]
      }else{
        this.activeParams[param] = value
      }
    }

    this.activeParams.page=1
    this.router.navigate(['/catalog'],{
      queryParams:this.activeParams
    })
  
  }
}
