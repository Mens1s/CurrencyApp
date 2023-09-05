import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './css/sb-admin-2.min.css', './vendor/fontawesome-free/css/all.min.css']
})
export class LoginComponent implements OnInit {
  public loginStatus: string | null = null;
  public loginStatusClass: string | null = null;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userService.checkLoginStatus();

    if(this.authService.isLoggedIn()){
      this.router.navigate(['dashboard']);
    }
    
    this.userService.getLoginStatus().subscribe((loginStatus) => {
      this.loginStatus = loginStatus;
      if(loginStatus == "Kullanici adi ya da şifre hatali!"){
        this.loginStatusClass = "alert-danger";
      }else{
        this.loginStatusClass = "alert-success";
      }
    })

    

  }

  login(username: String, password: String){
    this.userService.login(username, password)
  }
  

  getLoginStatus() {
    return this.loginStatus;
  }

  getLoginStatusClass () {
    return this.loginStatusClass;
  }
}
