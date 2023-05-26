import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) {}
  // private base_url = 'http://127.0.0.1:5000'
  // private base_url = 'http://192.168.29.61:5000'
  // private base_url = 'https://techopoly.babaherons.in/api'
  private base_url = 'https://techopoly-api.azurewebsites.net'
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' })
  private code_header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  
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
  players_team_id_edit_put(team_id:any, id:any, data:any){
    return this.http.put(this.base_url + `/players/${team_id}/${id}`, data, {'headers':this.headers})
  }

  // TEAM STATUS
  status_all_get(){
    return this.http.get(this.base_url + '/status')
  }
  status_id_get(team_id:any){
    return this.http.get(this.base_url + `/status/${team_id}`)
  }
  status_id_position_update_put(team_id:any, data:any){
    return this.http.put(this.base_url + `/status/${team_id}`, data, {'headers':this.headers})
  }
  status_id_rewards_ques_update_put(team_id:any, data:any){
    return this.http.put(this.base_url + `/status/rewads/${team_id}`, data, {'headers':this.headers})
  }
  status_id_coding_ques_update_put(team_id:any, data:any){
    return this.http.put(this.base_url + `/status/questions/${team_id}`, data, {'headers':this.headers})
  }
  status_id_active_update_put(team_id:any, data:any){
    return this.http.put(this.base_url + `/status/active/${team_id}`, data, {'headers':this.headers})
  }

  // TRANSACTIONS
  transactions_team_id_get(team_id:any){
    return this.http.get(this.base_url + `/transactions/${team_id}`)
  }
  transactions_team_id_post(team_id:any, data:any){
    return this.http.post(this.base_url + `/transactions/${team_id}`, data)
  }
  transactions_all_get(){
    return this.http.get(this.base_url + '/transactions')
  }

  // ASSETS
  assets_all_get(){
    return this.http.get(this.base_url + '/assets')
  }
  assets_box_id_get(box_id:any){
    return this.http.get(this.base_url + `/assets/${box_id}`)
  }
  assets_team_id_get(team_id:any){
    return this.http.get(this.base_url + `/assets/team/${team_id}`)
  }

  // NON-ASSETS
  non_assets_all_get(){
    return this.http.get(this.base_url + '/nonassets')
  }
  non_assets_box_index_get(box_index:any){
    return this.http.get(this.base_url + `/nonassets/${box_index}`)
  }
  non_assets_treasury_timeout_put(box_index:any, data:any){
    return this.http.put(this.base_url + `/nonassets/${box_index}`, data, {'headers':this.headers})
  }

  // PENALTY
  penalty_all_get(){
    return this.http.get(this.base_url + '/penalty')
  }
  penalty_post(data:any){
    return this.http.post(this.base_url + '/penalty', data, {'headers':this.headers})
  }
  penalty_random_get(data:any){
    return this.http.get(this.base_url + '/penalty/random')
  }

  // REWARDS
  rewards_all_get(){
    return this.http.get(this.base_url + '/rewards')
  }
  rewards_post(data:any){
    return this.http.post(this.base_url + '/rewards', data, {'headers':this.headers})
  }
  rewards_team_id_get(team_id:any){
    return this.http.get(this.base_url + `/rewards/teams/${team_id}`)
  }

  // CODING QUESTIONS
  questions_all_get(){
    return this.http.get(this.base_url + '/questions')
  }
  questions_post(data:any){
    return this.http.post(this.base_url + '/questions', data, {'headers':this.headers})
  }
  question_image_get(id:any){
    return this.http.get(this.base_url + `/questions/${id}`, {responseType:'blob'})
  }
  question_image_put(id:any, file:any){
    return this.http.put(this.base_url + `/questions/${id}`, file)
  }
  question_random_team_id_get(team_id:any, level:any){
    return this.http.get(this.base_url + `/questions/teams/${team_id}/${level}`)
  }
  question_edit_id(id:any, data:any){
    return this.http.put(this.base_url + `/questions/edit/${id}`, data, {'headers':this.headers})
  }

  // FOR GETTING OUTPUT FROM USER CODE
  code_output(data:any){
    return this.http.post("https://api.codex.jaagrav.in", data, {'headers':this.headers})
  }
  

}
