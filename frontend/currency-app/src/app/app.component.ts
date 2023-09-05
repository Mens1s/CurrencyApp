import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'; // Adjust the path accordingly
import { User } from './common/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'currency-app';
  isRegister = false;

  constructor(private router: Router,public authService: AuthService) {
    
      console.log("hs");
  } // Make authService public

  OnInit(){
    console.log(this.isRegister);
    if(this.router.url.includes('register')){
      this.isRegister = true;
    }
    console.log(this.isRegister);
  }
}
