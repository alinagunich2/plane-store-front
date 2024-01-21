import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent {
 @Input() count:number=1

  @Output() onCountChange:EventEmitter<number> = new EventEmitter<number>()

  countChange():void{
    
    this.onCountChange.emit(this.count)
  }
  decreaseCount(){
    if(this.count>1){
      this.count--;
      this.countChange()
    }
  }
  increateCount(){
      this.count++
      this.countChange()
  }
}
