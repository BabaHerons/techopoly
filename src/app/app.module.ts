import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeamDpComponent } from './team-dp/team-dp.component';
import { LoginComponent } from './admin/login/login.component';
import { LeaderboardComponent } from './admin/leaderboard/leaderboard.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { CodeEditorModule } from '@ngstack/code-editor';
import { QuestionsComponent } from './admin/questions/questions.component';
import { RewardsComponent } from './admin/rewards/rewards.component';
import { PenaltyComponent } from './admin/penalty/penalty.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    TeamDpComponent,
    LoginComponent,
    LeaderboardComponent,
    AdminHomeComponent,
    QuestionsComponent,
    RewardsComponent,
    PenaltyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    CodeEditorModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
