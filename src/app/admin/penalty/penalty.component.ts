import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.css']
})
export class PenaltyComponent {
  constructor(private api:ApiService, private tostr:ToastrService, private t:Title) {}

  ngOnInit(){
    this.t.setTitle('Add Penalty Statements | Techopoly')

    this.penalty_form.reset()

    this.api.penalty_all_get().subscribe(res => this.penalties = res)    
  }

  penalties:any = []

  penalty_form = new FormGroup({
    statement: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required)
  })

  add_penalty(){
    if (this.penalty_form.controls['statement'].invalid){
      this.tostr.warning("Penalty Statement cannot be empty")
    }
    else if (this.penalty_form.controls['value'].invalid){
      this.tostr.warning("Penalty Charge cannot be empty")
    }
    else {
      this.api.penalty_post(this.penalty_form.value).subscribe(res => this.tostr.success('Penalty Statement added'),
      (error) => {
        console.log('error', error);
        this.tostr.error(error.statusText, 'Server Error');
      })

      this.ngOnInit();
    }
  }
}
