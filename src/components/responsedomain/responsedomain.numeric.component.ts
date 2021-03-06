import {Component, Input} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';

@Component({
  selector: 'responsedomain-numeric',
  moduleId: module.id,
  template: `<div class="row">
        <form>
          <input type="number" min="{{low}}" max="{{high}}"
            id="numeric-domain-{{responseDomain.id}}"
            [ngModel]="value"
            (ngModelChange)="changeNumber($event)">
          <label>Range from {{low}} to {{high}}</label>
        </form>
      </div>`,
  styles: [],
  pipes: [],
  directives: []
})

export class ResponsedomainNumericComponent {
  @Input() responseDomain: ResponseDomain;
  private low: number;
  private high: number;
  private value: number;

  ngOnInit() {
    this.low = 0;
    this.high = 1;
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined) {
      if (rep.inputLimit !== undefined
        && rep.inputLimit.maximum !== undefined) {
        this.high = parseInt(rep.inputLimit.maximum);
      }
      if (rep.inputLimit !== undefined
        && rep.inputLimit.minimum !== undefined) {
        this.low = parseInt(rep.inputLimit.minimum);
      }
    }
  }

  changeNumber(value: number) {
    if(value >= this.low && value <= this.high) {
      this.value = value;
    } else if(value < this.low) {
      this.value = this.low;
    } else if(value > this.high) {
      this.value = this.high;
    }
  }
}
