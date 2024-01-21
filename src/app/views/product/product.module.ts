import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { DetailComponent } from './detail/detail.component';
import { CatalogComponent } from './catalog/catalog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    DetailComponent,
    CatalogComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    CarouselModule
  ]
})
export class ProductModule { }
