import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {DomainType, DomainTypeDescription} from './responsedomain.constant';
import {ResponseDomainService, ResponseDomain} from './responsedomain.service';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {ResponsedomainFormComponent} from './responsedomain.form.component';

@Component({
  selector: 'responsedomain-reuse',
  moduleId: module.id,
  template: `
    <div *ngIf="isVisible" class="row">
      <div *ngIf="responseDomain === null">
        <div class="response-domain-title">
			    <span name="text">Domain Type:</span>
			  </div>
			  <div class="col left" *ngFor="#domain of domainTypeDescription">
				  <input name="domaintypegroup" type="radio" id="rdomain-type-{{domain.id}}"
          (click)="selectDomainType(domain.id)" [checked]="domainType === domain.id"
				  />
          <label [attr.for]="'rdomain-type-' + domain.id">{{domain.label}}</label>
			  </div>
        <div class="col right">
          <i class="material-icons right" (click)="createResponseDomain()" title="new">add</i>
        </div>
        <div class="col right">
          <i class="material-icons right" (click)="reuse()" title="reuse">autorenew</i>
        </div>
      </div>
      <div *ngIf="showAutocomplete && responseDomains.length > 0">
        <autocomplete [items]="responseDomains" class="black-text"
          [searchField]="'name'"
          (autocompleteFocusEvent)="selectedIndex=idx;"
          [initialValue]="''"
          (autocompleteSelectEvent)="select($event)">
        </autocomplete>
      </div>
      <responsedomain-form *ngIf="responseDomain"
        (formChange)="formChange()" [responsedomain]="responseDomain" [domainType]="domainType">
      </responsedomain-form>
    </div>`,
  styles: [],
  pipes: [],
  providers: [ResponseDomainService],
  directives: [AutocompleteComponent, ResponsedomainFormComponent]
})

export class ResponsedomainReuseComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
  @Output() responseDomainReuse: EventEmitter<any> = new EventEmitter();
  public domainTypeDef = DomainType;
  public domainTypeDescription: any[] = DomainTypeDescription;
  private domainType: DomainType;
  private showAutocomplete: boolean;
  private responseDomains: any;
  private selectedIndex: number;

  constructor(private responseDomainService: ResponseDomainService) {
    this.showAutocomplete = false;
    this.domainType = DomainType.SCALE;
    this.responseDomains = [];
    this.selectedIndex = 0;
  }

  ngOnInit() {
    if (this.responseDomain !== undefined && this.responseDomain !== null) {
      let description = this.domainTypeDescription.find(e => e.name === this.responseDomain.responseKind);
      if (description !== undefined) {
        this.domainType = description.id;
      }
    }
  }

  formChange() {
    if (this.responseDomain.id !== undefined && this.responseDomain.id !== '') {
      this.responseDomainService.update(this.responseDomain).subscribe(result => {
        this.responseDomain = result;
        this.responseDomainReuse.emit(this.responseDomain);
      });
    } else {
      this.responseDomainService.create(this.responseDomain).subscribe(result => {
        this.responseDomain = result;
        this.responseDomains.push(this.responseDomain);
        this.responseDomainReuse.emit(this.responseDomain);
      });
    }
    this.isVisible = false;
  }

  selectDomainType(id: DomainType) {
    this.domainType = id;
  }

  createResponseDomain() {
    this.showAutocomplete = false;
    this.responseDomain = new ResponseDomain();
    this.responseDomain.responseKind = DomainTypeDescription.find(e=>e.id === this.domainType).name;
  }

  reuse() {
    this.responseDomainService.getAll(DomainTypeDescription.find(e=>e.id === this.domainType).name).subscribe(result => {
      this.responseDomains = result.content;
      this.showAutocomplete = !this.showAutocomplete;
    });
  }

  select(responseDomain: any) {
    this.responseDomainReuse.emit(responseDomain);
    this.isVisible = false;
  }

  searchResponseDomains(key: string) {
    let name = DomainTypeDescription.find(e=>e.id === this.domainType).name;
    this.responseDomainService.getAll(name, key).subscribe(result => {
      this.responseDomains = result.content;
    });
  }
}
