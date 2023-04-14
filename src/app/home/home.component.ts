import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private t: Title, private tstr:ToastrService, private http:HttpClient, private router:Router) {}
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
      this.http.get(`http://localhost:3000/teams?team_id=${this.login_form.value.team_id}`).subscribe(
        res => {
        k = res
        if(k.length>0 && this.login_form.value.password === k[0].password){
          sessionStorage.setItem('team_id', k[0].team_id)
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
