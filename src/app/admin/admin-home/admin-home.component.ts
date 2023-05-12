import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent {
  constructor(
    private router: Router,
    private tostr: ToastrService,
    private api: ApiService,
    private t: Title
  ) {}
  ngOnInit() {
    this.t.setTitle('Admin - Home | Techopoly');
    
    this.teams = []
    this.teams_all = []
    // API CALL FOR GETTING ALL TEAMS
    this.api.teams_all().subscribe(res => {
      this.teams_all = res
      // console.log(this.teams_all)

      for (let team of this.teams_all){
        if (team.team_id != 'admin'){
          if (team.team_id != 'NONE'){
                let team_details:any = {
                team_id:'',
                team_password:'',
                team_name:'',
                players:[],
                team_status:[],
                team_dp:[]
              }

              // UPDATING TEAM ID
              team_details.team_id = team.team_id
              team_details.team_name = team.name
              team_details.team_password = team.password

              // UPDATING PLAYERS
              this.api.players_team_id_all(team.team_id).subscribe(res => {
                team_details.players = res
              })

              // UPDATING TEAM STATUS
              this.api.status_id_get(team.team_id).subscribe(res => {
                team_details.team_status = res
              })

              // UPDATING TEAM PROFILE PICTURE
              this.api.teams_profile_pic_team_id_get(team.team_id).subscribe((res: Blob) => {
                let objectURL = URL.createObjectURL(res);       
                team_details.team_dp = objectURL
                
              })

              this.teams.push(team_details)
              // console.log(team_details)
          }
        }
      }
      // console.log(this.teams)
    })
    
    this.register_form.reset();
    this.add_players_form.reset();
  }

  teams:any = []
  teams_all:any = []

  register_form = new FormGroup({
    team_id: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    team_name: new FormControl('', Validators.required),
    profile_pic: new FormControl('', Validators.required),
  });

  formData: FormData = new FormData();

  imgUpload(e: Event) {
    let fileList = (e.target as HTMLInputElement).files;
    let file = fileList?.item(fileList.length-1)
    // if ('profile_pic' in this.formData) {
    //   this.formData.delete('profile_pic');
    // }
    // this.formData.append('profile_pic', file as Blob);
    this.formData.set("profile_pic", file as Blob)
  }

  register() {
      if (this.register_form.controls['team_id'].invalid) {
        this.tostr.warning('Team ID cannot be empty');
      } else if (this.register_form.controls['team_name'].invalid) {
        this.tostr.warning('Team Name cannot be empty');
      } else if (this.register_form.controls['password'].invalid) {
        this.tostr.warning('Password cannot be empty');
      } else if (this.register_form.controls['profile_pic'].invalid) {
        this.tostr.warning('Please upload profile image');
      }
      else {
        // console.log(this.register_form.value)
        let data = {
          team_id: this.register_form.value.team_id,
          name: this.register_form.value.team_name,
          password: this.register_form.value.password,
        };
        let k: any = {};

        this.api.teams_create_post(data).subscribe(
          (res) => {
            console.log(res);
            k = res;
            if (
              k.team_id === data.team_id &&
              k.name === data.name &&
              k.password === data.password
            ) {
              this.tostr.success('Team added');
            }

            // FOLLOWING CODE IS FOR UPLOADING THE IMAGE FILE
            this.api.teams_profile_pic_post(data.team_id, this.formData).subscribe(
              (res) => {
                k = res;
                if (k.message.includes('Upload successfull')) {
                  this.tostr.success('Profile Picture uploaded.');
                }
              },
              (error) => {
                console.log('error', error);
                this.tostr.error(error.statusText, 'Server Error');
              }
            );
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }
      this.ngOnInit()
    }

  add_players_form = new FormGroup({
    team_id: new FormControl('', Validators.required),
    player_one_name: new FormControl('', Validators.required),
    player_one_email: new FormControl('', Validators.required),
    player_two_name: new FormControl(''),
    player_two_email: new FormControl(''),
    player_three_name: new FormControl(''),
    player_three_email: new FormControl(''),
    player_four_name: new FormControl(''),
    player_four_email: new FormControl(''),
  });

  add_players() {
    let data = {
      team_id: this.add_players_form.value.team_id,
    };
    let k: any = {};

    if (this.add_players_form.controls['player_one_name'].invalid){
      this.tostr.warning("Player 1 Name cannot be empty")
    }
    else if (this.add_players_form.controls['player_one_email'].invalid){
      this.tostr.warning("Player 1 Email cannot be empty")
    }
    else {
      // FOLLOWING CODE IS FOR PLAYERS ONE DETAILS
      if (
        this.add_players_form.value.player_one_name &&
        this.add_players_form.value.player_one_email
      ) {
        console.log('hello one');
        let player_one_data = {
          name: this.add_players_form.value.player_one_name,
          email: this.add_players_form.value.player_one_email,
        };
        this.api.players_team_id_add(data.team_id, player_one_data).subscribe(
          (res) => {
            k = res;
            if (k.message.includes('Player Added')) {
              this.tostr.success('Player 1 added');
            }
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }

      // FOLLOWING CODE IS FOR PLAYERS TWO DETAILS
      if (
        this.add_players_form.value.player_two_name &&
        this.add_players_form.value.player_two_email
      ) {
        console.log('hello two');
        let player_two_data = {
          name: this.add_players_form.value.player_two_name,
          email: this.add_players_form.value.player_two_email,
        };
        this.api.players_team_id_add(data.team_id, player_two_data).subscribe(
          (res) => {
            k = res;
            if (k.message.includes('Player Added')) {
              this.tostr.success('Player 2 added');
            }
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }

      // FOLLOWING CODE IS FOR PLAYERS THREE DETAILS
      if (
        this.add_players_form.value.player_three_name &&
        this.add_players_form.value.player_three_email
      ) {
        console.log('hello three');
        let player_three_data = {
          name: this.add_players_form.value.player_three_name,
          email: this.add_players_form.value.player_three_email,
        };
        this.api.players_team_id_add(data.team_id, player_three_data).subscribe(
          (res) => {
            k = res;
            if (k.message.includes('Player Added')) {
              this.tostr.success('Player 3 added');
            }
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }

      // FOLLOWING CODE IS FOR PLAYERS FOUR DETAILS
      if (
        this.add_players_form.value.player_four_name &&
        this.add_players_form.value.player_four_email
      ) {
        console.log('hello four');
        let player_four_data = {
          name: this.add_players_form.value.player_four_name,
          email: this.add_players_form.value.player_four_email,
        };
        this.api.players_team_id_add(data.team_id, player_four_data).subscribe(
          (res) => {
            k = res;
            if (k.message.includes('Player Added')) {
              this.tostr.success('Player 4 added');
            }
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }
    }

    this.ngOnInit()
  }

  toggle_edit_modal(){
    let ele = document.getElementById('editUserModal')
    ele?.classList.toggle('hidden')
  }

  edit_team_details_form = new FormGroup({
    team_id: new FormControl({value: '', disabled:true }, Validators.required),
    password: new FormControl('', Validators.required),
    team_name: new FormControl('', Validators.required),
    profile_pic: new FormControl('', Validators.required),
    player_one_name: new FormControl('', Validators.required),
    player_one_email: new FormControl('', Validators.required),
    player_two_name: new FormControl(''),
    player_two_email: new FormControl(''),
    player_three_name: new FormControl(''),
    player_three_email: new FormControl(''),
    player_four_name: new FormControl(''),
    player_four_email: new FormControl(''),
  })

  selected_team_id = ''
  selected_players:any = []
  get_team_details(team_id:any){
    this.edit_team_details_form.reset()
    this.selected_players = []
    
    this.selected_team_id = team_id
    
    for (let team of this.teams){
      if (team.team_id == team_id){
        this.edit_team_details_form.patchValue({
          team_id: team.team_id,
          password: team.team_password,
          team_name: team.team_name,
        })

        if (team.players.length == 1){
          this.selected_players.push(team.players[0].id)
          this.edit_team_details_form.patchValue({
            player_one_name: team.players[0].name,
            player_one_email:team.players[0].email
          })
        }
        else if (team.players.length == 2){
          this.selected_players.push(team.players[0].id)
          this.selected_players.push(team.players[1].id)
          this.edit_team_details_form.patchValue({
            player_one_name: team.players[0].name,
            player_one_email:team.players[0].email,
            player_two_name: team.players[1].name,
            player_two_email:team.players[1].email
          })
        }
        else if (team.players.length == 3){
          this.selected_players.push(team.players[0].id)
          this.selected_players.push(team.players[1].id)
          this.selected_players.push(team.players[2].id)
          this.edit_team_details_form.patchValue({
            player_one_name: team.players[0].name,
            player_one_email:team.players[0].email,
            player_two_name: team.players[1].name,
            player_two_email:team.players[1].email,
            player_three_name: team.players[2].name,
            player_three_email:team.players[2].email
          })
        }
        else if (team.players.length == 4){
          this.selected_players.push(team.players[0].id)
          this.selected_players.push(team.players[1].id)
          this.selected_players.push(team.players[2].id)
          this.selected_players.push(team.players[3].id)
          this.edit_team_details_form.patchValue({
            player_one_name: team.players[0].name,
            player_one_email:team.players[0].email,
            player_two_name: team.players[1].name,
            player_two_email:team.players[1].email,
            player_three_name: team.players[2].name,
            player_three_email:team.players[2].email,
            player_four_name: team.players[3].name,
            player_four_email:team.players[3].email
          })
        }
      }
    }
  }

  update_details(){
    let team_id = this.selected_team_id
    let data = {
      team_id: team_id,
      name: this.edit_team_details_form.value.team_name,
      password: this.edit_team_details_form.value.password,
      id:this.selected_players
    };
    let k:any = {}
    this.api.teams_edit_put(team_id, data).subscribe(res => {
      k = res
      if (k.team_id === team_id){
        this.tostr.success('Edit Successfully', `${team_id}`)
      }

      // FOLLOWING CODE IS FOR UPLOADING THE IMAGE FILE
      if (!this.edit_team_details_form.controls['profile_pic'].invalid){
        this.api.teams_profile_pic_post(data.team_id, this.formData).subscribe(
          (res) => {
            
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }

      // FOLLOWING CODE IS FOR PLAYERS ONE DETAILS
      if (
        this.edit_team_details_form.value.player_one_name &&
        this.edit_team_details_form.value.player_one_email
      ) {
        console.log('hello one');
        let player_one_data = {
          name: this.edit_team_details_form.value.player_one_name,
          email: this.edit_team_details_form.value.player_one_email,
        };
        this.api.players_team_id_edit_put(data.team_id, data.id[0], player_one_data).subscribe(
          (res) => {
            k = res;
            console.log(res)
            console.log(data.id[0])
            if (k.message.includes('Player Updated')) {
              this.tostr.success('Player 1 Updated');
            }
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }

      // FOLLOWING CODE IS FOR PLAYERS TWO DETAILS
      if (
        this.edit_team_details_form.value.player_two_name &&
        this.edit_team_details_form.value.player_two_email
      ) {
        console.log('hello two');
        let player_two_data = {
          name: this.edit_team_details_form.value.player_two_name,
          email: this.edit_team_details_form.value.player_two_email,
        };
        this.api.players_team_id_edit_put(data.team_id, data.id[1], player_two_data).subscribe(
          (res) => {
            k = res;
            if (k.message.includes('Player Updated')) {
              this.tostr.success('Player 2 Updated');
            }
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }

      // FOLLOWING CODE IS FOR PLAYERS THREE DETAILS
      if (
        this.edit_team_details_form.value.player_three_name &&
        this.edit_team_details_form.value.player_three_email
      ) {
        console.log('hello three');
        let player_three_data = {
          name: this.edit_team_details_form.value.player_three_name,
          email: this.edit_team_details_form.value.player_three_email,
        };
        this.api.players_team_id_edit_put(data.team_id, data.id[2], player_three_data).subscribe(
          (res) => {
            k = res;
            if (k.message.includes('Player Updated')) {
              this.tostr.success('Player 3 Updated');
            }
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }

      // FOLLOWING CODE IS FOR PLAYERS FOUR DETAILS
      if (
        this.edit_team_details_form.value.player_four_name &&
        this.edit_team_details_form.value.player_four_email
      ) {
        console.log('hello four');
        let player_four_data = {
          name: this.edit_team_details_form.value.player_four_name,
          email: this.edit_team_details_form.value.player_four_email,
        };
        this.api.players_team_id_edit_put(data.team_id, data.id[3], player_four_data).subscribe(
          (res) => {
            k = res;
            if (k.message.includes('Player Updated')) {
              this.tostr.success('Player 4 Updated');
            }
          },
          (error) => {
            console.log('error', error);
            this.tostr.error(error.statusText, 'Server Error');
          }
        );
      }
    },
    (error) => {
      console.log('error', error);
      this.tostr.error(error.statusText, 'Server Error');
    })

    this.ngOnInit()
  }

  sign_out = () => {
    sessionStorage.removeItem('admin');
    this.router.navigate(['admin']);
    this.tostr.success('Sign Out successful');
  };
}
