import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../common/user'; // Import the User model
import { map } from 'rxjs/operators'; // Import the map operator
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: any;
  private loginStatus = new Subject<string>();
  private registerStatus = new Subject<string>();
  private registerBoolean = false;

  constructor(private http: HttpClient,private authService: AuthService) {}


  public login(username: String, password: String){
    event?.preventDefault();

    const loginData = {
      username: username, 
      password: password
    };

    const url = "http://localhost:8080/api/users/login";

    this.http.post<User>(url, loginData).subscribe(
      (response: User) => {
        this.setUser(response);
        this.loginStatus.next("Giriş Başarılı!");
        this.authService.login();
        this.setLoginStatusInLocalStorage(true, response);
      },
      (error) => {
        console.error("Login error:", error);
        this.loginStatus.next("Kullanici adi ya da şifre hatali!")
      }
    )

  }

  public register(firstName :string, lastName :string, username: string, tel :string, email :string, password :string, passwordRetype :string){
    event?.preventDefault();

    if(password != passwordRetype) {
      this.registerStatus.next("Şifreleriniz Uyuşmuyor lütfen tekrar giriniz.")
    }else{
      const url = "http://localhost:8080/api/users/register";
      const registerData = {
        name: firstName,
        surname: lastName,
        username: username,
        phone: tel,
        email: email,
        password: password,
        balance: 10000
      };

      this.http.post<User>(url, registerData).subscribe(
        (response: User) => {
          this.setUser(response);
          this.registerStatus.next("Giriş Başarılı!");
          this.authService.login();
          this.setLoginStatusInLocalStorage(true, response);
          this.registerBoolean = true;
        },
        (error) => {
          console.error("Login error:", error);
          this.registerStatus.next("Kullanici adi kullanılmaktadır."),
          this.registerBoolean = false;
        }
      )
    }
  }
  private setLoginStatusInLocalStorage(status: boolean, user: User) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3); // 3 days from now
  
    const loginData = {
      status: status,
      expires: expirationDate.getTime(), // Store expiration timestamp
      user: user, // Store user data
    };
  
    localStorage.setItem('loginData', JSON.stringify(loginData));
  }

  public checkLoginStatus() {
    const loginDataString = localStorage.getItem('loginData');
  
    if (loginDataString !== null) {
      const loginData = JSON.parse(loginDataString);
  
      if (loginData && loginData.status && loginData.expires && loginData.user) {
        const expirationDate = new Date(loginData.expires);
        if (expirationDate > new Date()) {
          // The login status is still valid, set it in the component
          this.loginStatus.next("Giriş Basarili");
          this.authService.login();
          this.user = loginData.user; // Set user data
        } else {
          // The login status has expired, clear it from localStorage
          localStorage.removeItem('loginData');
        }
      }
    }
  }

  public getRegisterBoolean(){
    return this.registerBoolean;
  }

  public logout(){
    localStorage.removeItem('loginData');
    this.authService.logout();
    this.user = null;
  }

  getLoginStatus() {
    return this.loginStatus.asObservable();
  }

  getRegisterStatus(){
    return this.registerStatus.asObservable();
  }

  setUser(user: any){
    this.user=user;
  }

  getUser(){
    return this.user;
  }

  // Add more methods for other user-related API operations as needed
}
