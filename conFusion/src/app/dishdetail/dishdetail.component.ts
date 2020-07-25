import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { Params,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { DISHES } from '../shared/dishes';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
    
    
    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    feedback: Comment;
    feedbackForm: FormGroup;
    
  constructor(private dishService: DishService ,private route: ActivatedRoute, private location: Location, private fb: FormBuilder,@Inject('BaseURL') private BaseURL) {
    this.createForm();
  }
    
    formErrors = {
        'author': '',
        'rating': '',
        'comment': ''
    }
    
    validationMessages = {
        'author':{
            'required': 'Author is required.',
            'minlength': 'Author must be at least 2 characters long.'
        },
        'comment':{
            'required': 'Comment is required.'
        }
    }
    
    createForm(){
        this.feedbackForm = this.fb.group({
            author: ['',[Validators.required,Validators.minLength(2)]],
            rating: [5,Validators.required],
            comment:['',Validators.required]
        })
        this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
        
        this.onValueChanged();
    }
    
    onValueChanged(data?: any){
        if(!this.feedbackForm){
            return;
        }
        const form = this.feedbackForm;
        for (const field in this.formErrors){
            if(this.formErrors.hasOwnProperty(field)){
                this.formErrors[field] = '';
                const control = form.get(field);
                if(control && control.dirty && !control.valid){
                    const messages = this.validationMessages[field];
                    for(const key in control.errors){
                        if(control.errors.hasOwnProperty(key)){
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    }
    
    onSubmit(){
        const submitedComment: Comment = {
            author: this.feedbackForm.value.author,
            rating: this.feedbackForm.value.rating,
            comment: this.feedbackForm.value.comment,
            date: new Date().toISOString(),
        };
                
        this.dish.comments.push(submitedComment);     
        
        this.feedbackForm.reset({
            author: '',
            rating: 5,
            comment: ''
        });

    }

  ngOnInit() {
      this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }
    
    setPrevNext(dishId: string){
        const index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
    }
    
    goBack(): void{
        this.location.back();
    }

}
