import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async login(username: String, password: String){
    await this.userService.login(username, password);

    await this.delay(1000);

    if(this.authService.isLoggedIn())

      this.router.navigate(['dashboard']);
    
    
  }
  

  getLoginStatus() {
    return this.loginStatus;
  }

  getLoginStatusClass () {
    return this.loginStatusClass;
  }
}
