import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './admin/login/login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { LeaderboardComponent } from './admin/leaderboard/leaderboard.component';
import { AdminAuthGuard } from './guard/admin/admin-auth.guard';
import { QuestionsComponent } from './admin/questions/questions.component';
import { RewardsComponent } from './admin/rewards/rewards.component';
import { PenaltyComponent } from './admin/penalty/penalty.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'admin',
    component:LoginComponent
  },
  {
    path:'admin/home',
    component:AdminHomeComponent,
    canActivate:[AdminAuthGuard]
  },
  {
    path:'admin/leaderboard',
    component:LeaderboardComponent,
    canActivate:[AdminAuthGuard]
  },
  {
    path:'admin/questions',
    component:QuestionsComponent,
    canActivate:[AdminAuthGuard]
  },
  {
    path:'admin/rewards',
    component:RewardsComponent,
    canActivate:[AdminAuthGuard]
  },
  {
    path:'admin/penalty',
    component:PenaltyComponent,
    canActivate:[AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
