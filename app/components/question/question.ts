import {Injectable,Component,ElementRef,Output,EventEmitter} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {ROUTER_DIRECTIVES} from "angular2/router";

import {HomeCmp} from "../home/home";
import {Question,QuestionService} from "./questionservice";
import {QuestionList} from "./question_list";
import {QuestionDetail} from "./question_detail";
import {UserService} from "../../common/userservice";
import {LoginComponent} from "../login/login";

@Component({
  selector: 'question',
  templateUrl: './components/question/question.html',
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent,
    QuestionList
  ],
  providers:[QuestionService]
})

export class QuestionComp {

  private showQuestionDetail;
  private questionService;
  private questions;
  private selectedQuestion;
  @Output() questionCreateEvent: EventEmitter<String> = new EventEmitter();
  private user:any;

  constructor(private questionService: QuestionService,private userService: UserService) {

    this.questions = this.questionService.getModel();
  }
  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  loginEvent() {
    this.user = this.userService.get();
  }

  ngOnInit() {
    console.log("init");
    //jQuery(this.elementRef.nativeElement).find('select').material_select();
  }

  save() {
    this.showQuestionDetail = false;
    this.questionService.save(this.selectedQuestion);
    this.questions = this.questionService.getModel();
    this.selectedQuestion = new Question();
  }

  toggleSurveyForm() {
    //jQuery(this.elementRef.nativeElement).find('select').material_select();
    this.showQuestionDetail = !this.showQuestionDetail;
  }

  create(question: any) {
    this.questionCreateEvent.emit(question);
  }
}
