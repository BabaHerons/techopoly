import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../service/api/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private router:Router, private tostr:ToastrService, private api:ApiService) {}

  ngOnInit(){
    this.list[0] = this.team_position
    this.live_transaction = []
    this.api.transactions_all_get().subscribe(res => {
      let k:any = []
      k = res
      this.live_transaction = k[k.length-1]
      console.log(this.live_transaction)
    })

    this.my_details = {
      team_id: sessionStorage.getItem('team_id'),
      name: '',
      assets: '',
      cash: '',
      net_worth: '',
      recent_transaction: {
        gain:'',
        amount:'',
        assets:''
      },
      profile_pic: ''
    }
    
    // GETTING TEAM PROFILE PICTURE
    this.api.teams_profile_pic_team_id_get(this.my_details.team_id).subscribe((res: Blob) => {
      let objectURL = URL.createObjectURL(res);       
      this.my_details.profile_pic = objectURL
    })

    // GETTING TEAM NAME
    this.api.teams_id_get(this.my_details.team_id).subscribe(res => {
      k = res
      this.my_details.name = k.name
    })

    // GETTING TEAM ASSETS, CASH, NET_WORTH
    let k:any = {}
    this.api.status_id_get(this.my_details.team_id).subscribe(res => {
      k = res
      this.my_details.assets = k.assets
      this.my_details.cash = k.cash
      this.my_details.net_worth = k.net_worth
    })

    // GETTING TEAM LATEST TRANSACTION
    this.api.transactions_team_id_get(this.my_details.team_id).subscribe(res => {
      k = res
      this.my_details.recent_transaction = k[k.length-1]
    })

    // GETTING TEAM STATUS
    this.team_status = []
    this.api.status_all_get().subscribe(res => {
      k = res
      this.team_status = k
    
      this.team_status_dp = []
      for (let team of this.team_status){
        if (team.team_id != 'admin'){
          if (team.team_id != 'NONE'){
            this.api.teams_profile_pic_team_id_get(team.team_id).subscribe((res: Blob) => {
              let objectURL = URL.createObjectURL(res);       
              this.team_status_dp.push({
                id:team.team_id,
                dp:objectURL
              })
            })
          }
        }
      }
    })

    setTimeout(()=>{
      for (let team of this.team_status){
        for (let team_dp of this.team_status_dp){
          if (team.team_id != 'admin'){
            if (team.team_id != 'NONE'){
              if (team_dp.id === team.team_id){
                this.wall_of_fame.push(team_dp.dp)
              }
            }
          }
        }
      }
    },1000)


    setInterval(() => {
      this.team_status = []
      this.wall_of_fame = []
      this.api.status_all_get().subscribe(res => {
        k = res
        this.team_status = k
      
        for (let team of this.team_status){
          for (let team_dp of this.team_status_dp){
            if (team.team_id != 'admin'){
              if (team.team_id != 'NONE'){
                if (team_dp.id === team.team_id){
                  this.wall_of_fame.push(team_dp.dp)
                }
              }
            }
          }
        }
        // console.log(this.team_status_dp)
        // console.log(this.team_status)
      })

      let k:any = []
      this.live_transaction = []
      this.api.transactions_all_get().subscribe(res => {
        k = res
        this.live_transaction = k[k.length-1]
        console.log(this.live_transaction)
    })
    },10000)
    
  }

  waitCount: number = 0;
  interval: any;
  isDisabled = false;
  style: any = {};
  result: number = 0;
  outcome:any;
  list = ['','','','','','','','','','','','','','','','','','','','',]
  team_id = sessionStorage.getItem('team_id')

  startTimer() {
    let btnDice = document.getElementById('btnDice')
    this.interval = setInterval(() => {
      if (this.waitCount > 0) {
        this.waitCount--;
      } else {
        clearInterval(this.interval);
        this.isDisabled = false;
        btnDice?.classList.toggle('roll')
        btnDice?.classList.toggle('roll-disabled')
      }
    }, 1000);
  }

  randomIntFromInterval(min: any, max: any) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  randomDice = () => {
    let btnDice = document.getElementById('btnDice')
    btnDice?.classList.toggle('roll')
    btnDice?.classList.toggle('roll-disabled')

    let rollInterval:any;
    let rollCount:number = 5
    rollInterval = setInterval(() => {
      if (rollCount > 0) {
        rollCount--;
        this.rollDice(this.randomIntFromInterval(1, 6))
      } else {
        clearInterval(rollInterval);
        this.outcome = this.result
        this.team_current_position()
      }
    }, 1000)

    this.waitCount = 10
    this.isDisabled = true;
    // let random = this.randomIntFromInterval(1, 6);
    // this.rollDice(random);
    this.startTimer();
  };

  rollDice = (random: any) => {
    this.style.animation = 'rolling 1s';

    setTimeout(() => {
      switch (random) {
        case 1:
          this.style.transform = 'rotateX(0deg) rotateY(0deg)';
          this.result = 1;
          break;

        case 6:
          this.style.transform = 'rotateX(180deg) rotateY(0deg)';
          this.result = 6;
          break;

        case 2:
          this.style.transform = 'rotateX(-90deg) rotateY(0deg)';
          this.result = 2;
          break;

        case 5:
          this.style.transform = 'rotateX(90deg) rotateY(0deg)';
          this.result = 5;
          break;

        case 3:
          this.style.transform = 'rotateX(0deg) rotateY(90deg)';
          this.result = 3;
          break;

        case 4:
          this.style.transform = 'rotateX(0deg) rotateY(-90deg)';
          this.result = 4;
          break;

        default:
          break;
      }

      this.style.animation = 'none';
      console.log(this.result);
    }, 100);
  };

  team_position = '<div class="absolute inline-block mt-[68px] mx-[34px]"><img class="inline-block object-cover w-10 h-10 rounded-full" src="https://images.pexels.com/photos/2955305/pexels-photo-2955305.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Profile image"/><span class="absolute bottom-0 right-0 inline-block w-3 h-3 bg-green-600 border-2 border-white rounded-full"></span></div>'
  team_current_position = () => {
    this.list[0]=''
    for (let i=1; i<20; i++){
      if (i === this.outcome){
        this.list[i] = this.team_position
      }
      else {
        this.list[i] = ''
      }
    }
  }

  toggle_portfolio = () => {
    let modal = document.getElementById('portfolio')
    modal?.classList.toggle('hidden')
  }

  my_details = {
    team_id: sessionStorage.getItem('team_id'),
    assets: '',
    cash: '',
    net_worth: '',
    recent_transaction: {
      gain:'',
      amount:'',
      assets:''
    },
    profile_pic: '',
    name:''
  }

  team_status:any = []
  team_status_dp:any = []
  wall_of_fame:any = []
  live_transaction:any = {}

  sign_out = () => {
    sessionStorage.removeItem('team_id')
    this.router.navigate([''])
    this.tostr.success('Sign Out successful')
  }
}
