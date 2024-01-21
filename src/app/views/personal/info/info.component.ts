import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/shared/services/user.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { DeliveryType } from 'src/types/delivery.type';
import { PaymentType } from 'src/types/payment.type';
import { UserInfoType } from 'src/types/user-info.type';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit{

  // deliveryType: DeliveryType = DeliveryType.delivery
  deliveryTypes=DeliveryType
  paymentType=PaymentType


  constructor(private fb:FormBuilder,
    private userService:UserService,
    private _snackBar:MatSnackBar){}


    ngOnInit(): void {
      this.userService.getUserInfo()
      .subscribe((data:UserInfoType|DefaultResponseType)=>{
        if((data as DefaultResponseType).error!==undefined){
          const error =(data as DefaultResponseType).message
          throw new Error(error)
        }

        const userInfo = data as UserInfoType

        const paramsToUpdate = {
          deliveryType:userInfo.deliveryType===DeliveryType.delivery ? DeliveryType.delivery :DeliveryType.self,
          firstName: userInfo.firstName ? userInfo.firstName :'',
          lastName: userInfo.lastName ? userInfo.lastName :'',
          fatherName:userInfo.fatherName ? userInfo.fatherName :'',
          phone: userInfo.phone ? userInfo.phone :'',
          paymentType:  userInfo.paymentType ? userInfo.paymentType :PaymentType.cashToCourier,
          email:  userInfo.email ? userInfo.email :'',
          street: userInfo.street ? userInfo.street :'',
          house: userInfo.house ? userInfo.house :'',
          entrance: userInfo.entrance ? userInfo.entrance :'',
          apartment: userInfo.apartment ? userInfo.apartment :'',
        }

        this.userInfoForm.setValue(paramsToUpdate)
      })
      
    }

  userInfoForm=this.fb.group({
    deliveryType:[DeliveryType.delivery],
    firstName: [''],
    lastName: [''],
    fatherName:[''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    email: ['',Validators.required],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
  })

  changeDeliveryType(deliveryType:DeliveryType){
    // this.deliveryType= type    

    this.userInfoForm.get('deliveryType')?.setValue(deliveryType)

    this.userInfoForm.markAsDirty()
    }

    updateUserInfo(){
      if(this.userInfoForm.valid){

        const paramObject:UserInfoType={
          email:this.userInfoForm.value.email ? this.userInfoForm.value.email : '',
          deliveryType:this.userInfoForm.value.deliveryType ? this.userInfoForm.value.deliveryType : DeliveryType.delivery,
          paymentType:this.userInfoForm.value.paymentType ? this.userInfoForm.value.paymentType :PaymentType.cardOnline
        }

        if(this.userInfoForm.value.lastName){
          paramObject.lastName=this.userInfoForm.value.lastName
        }
        if(this.userInfoForm.value.firstName){
          paramObject.firstName=this.userInfoForm.value.firstName
        }
        if(this.userInfoForm.value.phone){
          paramObject.phone=this.userInfoForm.value.phone
        }
        if(this.userInfoForm.value.street){
          paramObject.street=this.userInfoForm.value.street
        }
        if(this.userInfoForm.value.house){
          paramObject.house=this.userInfoForm.value.house
        }
        if(this.userInfoForm.value.entrance){
          paramObject.entrance=this.userInfoForm.value.entrance
        }
        if(this.userInfoForm.value.apartment){
          paramObject.apartment=this.userInfoForm.value.apartment
        }
     

        this.userService.updateUserInfo(paramObject)
          .subscribe({
            next: (data:DefaultResponseType)=>{
              if(data.error){
                this._snackBar.open(data.message)
                throw new Error(data.message)
              }

              this._snackBar.open("Данные сохранены")
              this.userInfoForm.markAsPristine()            },
            error:(err:HttpErrorResponse)=>{
              if(err.error&&err.error.message){
                this._snackBar.open(err.error.message)
              }else{
                this._snackBar.open('Ошибка сохранения')
              }
            }
          })
      }
      
    }
}
