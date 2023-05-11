import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) {}
  private base_url = 'http://127.0.0.1:5000'
  headers = new HttpHeaders({ 'Content-Type': 'application/json' })
  
  // FOR TEAMS
  teams_all(){
    return this.http.get(this.base_url+'/teams')
  }
  teams_id_get(team_id:any){
    return this.http.get(this.base_url+'/teams'+`/${team_id}`)
  }
  teams_create_post(data:any){
    return this.http.post(this.base_url + '/teams/add', data, {'headers':this.headers})
  }
  teams_edit_put(team_id:any, data:any){
    return this.http.put(this.base_url + `/teams/${team_id}`, data, {'headers':this.headers})
  }
  teams_profile_pic_post(team_id:any, file:any){
    return this.http.post(this.base_url + `/teams/${team_id}/profile-pic`, file)
  }
  teams_profile_pic_all_get(){
    return this.http.get(this.base_url + '/teams/profile-pic')
  }
  teams_profile_pic_team_id_get(team_id:any){
    return this.http.get(this.base_url + `/teams/${team_id}/profile-pic`, {responseType:'blob'})
  }


  // FOR PLAYERS
  players_all(){
    return this.http.get(this.base_url + '/players')
  }
  players_team_id_all(team_id:any){
    return this.http.get(this.base_url + `/players/${team_id}`)
  }
  players_team_id_add(team_id:any, data:any){
    return this.http.post(this.base_url + `/players/${team_id}`, data, {'headers':this.headers})
  }

  // TEAM STATUS
  status_all_get(){
    return this.http.get(this.base_url + '/status')
  }
  status_id_get(team_id:any){
    return this.http.get(this.base_url + `/status/${team_id}`)
  }
  

}
