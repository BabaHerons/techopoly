import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent {
  constructor() {}

  ngOnInit(){}

  rewards_form = new FormGroup({
    question: new FormControl('', Validators.required),
    a: new FormControl('', Validators.required),
    b: new FormControl('', Validators.required),
    c: new FormControl(''),
    d: new FormControl(''),
    ans: new FormControl('', Validators.required)
  })

  add_rewards(){
    
  }
}
