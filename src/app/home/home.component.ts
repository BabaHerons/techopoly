import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private t: Title, private tstr:ToastrService, private api:ApiService, private router:Router) {}
  ngOnInit() {
    this.t.setTitle('Home | Techopoly');
  }

  login_form = new FormGroup({
    team_id: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  signin = () => {
    if (this.login_form.controls['team_id'].invalid){
      this.tstr.warning('Team ID cannot be empty')
    }
    else if (this.login_form.controls['password'].invalid){
      this.tstr.warning('Password cannot be empty')
    }
    else {
      let k:any = []
      // this.http.get(`http://localhost:3000/teams?team_id=${this.login_form.value.team_id}`)
      this.api.teams_id_get(this.login_form.value.team_id).subscribe(
        res => {
        k = res
        if(k && this.login_form.value.password === k.password){
          sessionStorage.setItem('team_id', k.team_id)
          this.tstr.success('Login Successful')
          this.router.navigate(['dashboard'])
        }
        else {
          this.tstr.error('Invalid credentials')
        }
        },
        error => {
          console.log('error', error)
          this.tstr.error(error.statusText, 'Server Error')
        })
    }
    
  }
}
