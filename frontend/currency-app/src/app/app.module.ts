import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Adjust the path accordingly
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component'; 

const routes: Routes = [
  {path: 'admin', component:AdminComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, children:
      [
        {path: '', component: ProfileComponent},
        {path: ':keyword', component: TransactionComponent},
        {path:'**', redirectTo: ''}
      ]
    },

  {path: '', component: LoginComponent},
  { path: '**', redirectTo: '' }
]
@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, RegisterComponent, ProfileComponent, TransactionComponent, AdminComponent], // Include LoginComponent here
  imports: [RouterModule.forRoot(routes), BrowserModule, HttpClientModule, FormsModule],
  bootstrap: [AppComponent],
})
export class AppModule {
}
