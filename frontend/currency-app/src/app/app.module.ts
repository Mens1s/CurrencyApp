import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Adjust the path accordingly
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '', component: LoginComponent},
  { path: '**', redirectTo: '' }
]
@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, RegisterComponent], // Include LoginComponent here
  imports: [RouterModule.forRoot(routes), BrowserModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {
}
