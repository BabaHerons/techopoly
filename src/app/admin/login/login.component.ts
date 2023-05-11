import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private api:ApiService, private tostr:ToastrService, private router:Router, private t:Title) {}
  ngOnInit() {
    this.t.setTitle('Admin | Techopoly');
  }

  login_form = new FormGroup({
    team_id: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  signin = () => {
    if (this.login_form.controls['team_id'].invalid){
      this.tostr.warning('Team ID cannot be empty')
    }
    else if (this.login_form.controls['password'].invalid){
      this.tostr.warning('Password cannot be empty')
    }
    else {
      let k:any = []
      // this.http.get(`http://localhost:3000/teams?team_id=${this.login_form.value.team_id}`)
      this.api.teams_id_get(this.login_form.value.team_id).subscribe(
        res => {
        k = res
        if(k && this.login_form.value.password === k.password && k.role === 'admin'){
          sessionStorage.setItem('admin', k.team_id)
          this.tostr.success('Login Successful')
          this.router.navigate(['admin/home'])
        }
        else {
          this.tostr.error('ACCESS DENIED')
        }
        },
        error => {
          console.log('error', error)
          this.tostr.error(error.statusText, 'Server Error')
        })
    }
    
  }
}
