import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', './css/sb-admin-2.min.css', './vendor/fontawesome-free/css/all.min.css']
})
export class RegisterComponent implements OnInit {
  public registerStatus: string | null = null;

  constructor(private userService: UserService, private router: Router, private authService : AuthService) { }

  ngOnInit(): void {
    this.userService.checkLoginStatus();
    if(this.authService.isLoggedIn()){
      console.log("dsadsa");
      this.router.navigate(['dashboard']);
    }
    else{
      this.userService.getRegisterStatus().subscribe((registerStatus) => {
        this.registerStatus = registerStatus;
      })
    }
  }

  public register(firstName :string, lastName :string, username: string, tel :string, email :string, password :string, passwordRetype :string){
    this.userService.register(firstName,lastName,username,tel,email,password,passwordRetype);
    if(this.userService.getRegisterBoolean()){
      this.router.navigate(['']);
    }
  }
}
