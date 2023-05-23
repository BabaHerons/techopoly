import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {
  constructor(
    private router: Router,
    private tostr: ToastrService,
    private api: ApiService,
    private t: Title
  ) {}

  ngOnInit(){
    this.t.setTitle('Team Leaderboard | Techopoly')

    this.get_details()

    setTimeout(() => {
      this.main()
    }, 1000);

    setInterval(() => {
      this.main()
    },10000)
  }
  
  teams:any = [
      {
      "name":'',
      "id":'',
      "profile_pic":'',
      "assets":[],
      "cash":'',
      "net_worth":''
    },
      {
      "name":'',
      "id":'',
      "profile_pic":'',
      "assets":[],
      "cash":'',
      "net_worth":''
    },
      {
      "name":'',
      "id":'',
      "profile_pic":'',
      "assets":[],
      "cash":'',
      "net_worth":''
    }
  ]
  all_teams_details:any = []  //contains Name, ID
  all_teams_dp:any = []       //contains profile pic
  all_teams_status:any = []


  // GETTING TEAM DETAILS INCLUDING: NAME, ID, PROFILE PIC
  get_details(){

    // NAME, ID AND PROFILE PIC
    this.api.teams_all().subscribe(res => {

      // NAME, ID
      this.all_teams_details = res
      
      // PROFILE PIC
      this.all_teams_dp = []
      for (let team of this.all_teams_details){
        if(team.team_id != 'admin'){
          let obj:any = {
            "team_id" : "",
            "profile_pic" : ""
          }
          this.api.teams_profile_pic_team_id_get(team.team_id).subscribe((res: Blob) => {
            let objectURL = URL.createObjectURL(res);
            obj.team_id = team.team_id
            obj.profile_pic = objectURL

            this.all_teams_dp.push(obj)
          })
        }
      }
    })
  }

  // MAIN FUNCTION THAT UPDATES THE TEAMS
  main(){
    this.all_teams_status = []
    this.teams = []

    // ASSETS, CASH AND NET WORTH
    this.api.status_all_get().subscribe(res => {
      this.all_teams_status = res
      for (let t of this.all_teams_status){
        let team:any = {
          "name":'',
          "id":'',
          "profile_pic":'',
          "assets":[],
          "cash":'',
          "net_worth":''
        }
        team.id = t.team_id
        team.cash = t.cash
        team.net_worth = Number(t.net_worth)

        // SETTING THE TEAM ASSETS
        this.api.assets_team_id_get(t.team_id).subscribe(res => {
          let k:any = {}
          k = res
          team.assets = k
        })

        // SETTING THE TEAM NAME
        for (let member of this.all_teams_details){
          if (member.team_id == t.team_id){
            team.name = member.name
            break
          }
        }

        // SETTING THE TEAM PROFILE PIC
        for (let member of this.all_teams_dp){
          if (member.team_id == t.team_id){
            team.profile_pic = member.profile_pic
            break
          }
        }
        this.teams.push(team)
      }
    })

    // RECENT TRANSACTIONS AS NOTIFICATION
    this.api.transactions_all_get().subscribe(res => {
      let k:any = {}
      k = res
      this.tostr.info(`Team ${k[k.length - 1].team_id}: ${k[k.length - 1].message}`)
    })
  }

}
