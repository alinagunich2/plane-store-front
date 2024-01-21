import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrderStatusUtil } from 'src/app/shared/utils/order-status.util';
import { DefaultResponseType } from 'src/types/default-response.type';
import { OrderType } from 'src/types/order.type';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit{

  orders:OrderType[]=[]
  getStatusAndColor = OrderStatusUtil.getStatusAddColor

  constructor(private orderServise:OrderService){

  }

  ngOnInit(): void {
    this.orderServise.getOrders()
    .subscribe((data:OrderType[]|DefaultResponseType)=>{
      if((data as DefaultResponseType).error!==undefined){
        const error =(data as DefaultResponseType).message
        throw new Error(error)
      }

      this.orders=(data as OrderType[]).map(item=>{
       const status =  OrderStatusUtil.getStatusAddColor(item.status)
        item.statusRus = status.name
        item.color= status.color

        return item
      })



    })
  }

}
