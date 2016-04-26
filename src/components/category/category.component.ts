import {Component, EventEmitter, Output} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {CategoryService, Category} from './category.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {CategoryEditComponent} from './edit/category_edit.component';
import {CategoryRevision} from './category_revision.component';
import {CategoryType} from './category_kind';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';


@Component({
  selector: 'category',
  moduleId: module.id,
  templateUrl: './category.component.html',
  pipes: [LocalDatePipe],
  providers: [CategoryService],
  directives: [MaterializeDirective, CommentListComponent, CategoryEditComponent, CategoryRevision]
})
export class CategoryComponent {

  showCategoryForm: boolean = false;
  @Output() categorySelectedEvent: EventEmitter<any> = new EventEmitter();

  private categories: any;
  private category: any;
  private _CategoryEnums: any;

  constructor(private categoryService: CategoryService) {
    this.category = new Category();
    this._CategoryEnums =  CategoryType.kind;
  }

  ngAfterViewInit() {
    this.categoryService.getAll().subscribe(result => this.categories = result.content);
  }

  ngOnChanges() {
    this.categoryService.getAll()
      .subscribe(result => {
        this.categories = result;
      });
  }

  onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
  }

  onSelectCategory(category: any) {
    this.categorySelectedEvent.emit(category);
  }

  onSave() {
    this.showCategoryForm = false;
    this.categoryService.save(this.category)
      .subscribe(result => {
        this.categories.push(result);
      });
    this.category  = new Category();
  }

}