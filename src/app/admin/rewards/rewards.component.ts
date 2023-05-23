import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent {
  constructor(private api:ApiService, private tostr:ToastrService, private t:Title) {}

  ngOnInit(){
    this.t.setTitle('Add Rewards | Techopoly')

    this.rewards_form.reset()

    this.api.rewards_all_get().subscribe(res => {
      this.rewards = res
    })
  }

  rewards:any = []
  rewards_form = new FormGroup({
    question: new FormControl('', Validators.required),
    a: new FormControl('', Validators.required),
    b: new FormControl('', Validators.required),
    c: new FormControl(''),
    d: new FormControl(''),
    ans: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required)
  })

  add_rewards(){
    if (this.rewards_form.controls['question'].invalid){
      this.tostr.warning("Question cannot be empty")
    }
    else if (this.rewards_form.controls['a'].invalid){
      this.tostr.warning("Option A cannot be empty")
    }
    else if (this.rewards_form.controls['b'].invalid){
      this.tostr.warning("Option B cannot be empty")
    }
    else if (this.rewards_form.controls['ans'].invalid){
      this.tostr.warning("Correct Answer cannot be empty")
    }
    else if (this.rewards_form.controls['value'].invalid){
      this.tostr.warning("Value cannot be empty")
    }
    else {
      this.api.rewards_post(this.rewards_form.value).subscribe(res => {
        this.tostr.success('Question Added')
      },
      (error) => {
        console.log('error', error);
        this.tostr.error(error.statusText, 'Server Error');
      })
      this.ngOnInit();
    }
  }
}
