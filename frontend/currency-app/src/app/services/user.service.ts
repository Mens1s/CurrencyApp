import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../common/user'; // Import the User model
import { AuthService } from './auth.service';
import { CsrfService } from './csrf.service';

@Injectable({
  providedIn: 'root',
})


export class UserService {
  private user: any;

  private loginStatus = new Subject<string>();
  private transactionStatus = new Subject<string>(); 
  private transactionStatus_coin = new Subject<string>(); 
  private updateStatus = new Subject<string>(); 

  private registerStatus = new Subject<string>();
  private registerBoolean = false;

  constructor(private http: HttpClient,private authService: AuthService,private csrfService :CsrfService) {}


  public login(username: String, password: String) {
    event?.preventDefault();
  
    this.csrfService.getCsrfToken().subscribe(csrfToken => {
      const loginData = {
        username: username,
        password: password
      };
  
      const url = "http://localhost:8080/api/users/login";
  
      const headers = {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      }
  
      this.http.post<User>(url, loginData, { headers }).subscribe(
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
      );
    });
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
          this.login(username,password);
          this.registerBoolean = true;
          this.registerStatus.next("Kayıt Olma Başarılı!");
        
          
        },
        (error) => {
          console.error("Register error:", error);
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
      this.login(this.user.username, this.user.password);

    }
  }

  public buy(volume_of_coin:string, coin_name:string, volume_of_dolar:string){
      const transactionData = {
          "volume_of_coin": volume_of_coin,
          "coin_name": coin_name,
          "volume_of_dolar": volume_of_dolar,
          "type": "buy",
          "user": {
              "id": this.user.id
          }
        }

      console.log(transactionData);  
      
      const url = "http://localhost:8080/api/transactions/buy";

      this.http.post(url, transactionData, { responseType: 'text' }).subscribe(
        (response: string) => {
          // Check if the response message indicates success
          if (response.includes("Transaction created successfully")) {
            console.log('Transaction created successfully');
            this.transactionStatus.next("İşlem Başarılı!");
            this.updateUser();
          } else {
            console.log('Unexpected response:', response);
            // Handle unexpected response here
            this.transactionStatus.next("Hatali İşlem");
          }
        },
        (error) => {
          console.log('Error:', error);
          this.transactionStatus.next("Hatali İşlem");
        }
      );
    }

    public sell(volume_of_coin:string, coin_name:string, volume_of_dolar:string){
      const transactionData = {
          "volume_of_coin": volume_of_coin,
          "coin_name": coin_name,
          "volume_of_dolar": volume_of_dolar,
          "type": "sell",
          "user": {
              "id": this.user.id
          }
        }
      
      console.log(transactionData);  
      
      const url = "http://localhost:8080/api/transactions/sell";

      this.http.post(url, transactionData, { responseType: 'text' }).subscribe(
        (response: string) => {
          // Check if the response message indicates success
          if (response.includes("Transaction created successfully")) {
            console.log('Transaction created successfully');
            this.transactionStatus_coin.next("İşlem Başarılı!");
            this.updateUser();
          } else {
            console.log('Unexpected response:', response);
            // Handle unexpected response here
            this.transactionStatus_coin.next("Hatali İşlem");
          }
        },
        (error) => {
          console.log('Error:', error);
          this.transactionStatus_coin.next("Hatali İşlem");
        }
      );
    }

  private updateUser(){
    this.login(this.user.username, this.user.password);
  }

  public getRegisterBoolean(){
    return this.registerBoolean;
  }

  public getTransactionStatus(){
    return this.transactionStatus;
  }

  public getTransactionStatus_coin(){
    return this.transactionStatus_coin;
  }
  public logout(){
    localStorage.removeItem('loginData');
    this.authService.logout();
    this.user = null;

  }

  public getAllUsers(){
    const apiUrl = 'http://localhost:8080/api/users/getAll';

    return this.http.get<any[]>(apiUrl);
  }

  public updateUserDB(username:String, updatedUser:any){
    const apiUrl = 'http://localhost:8080/api/users/update/'+username;

    this.http.put<User>(apiUrl, updatedUser).subscribe(
      (response: User) => {
        if(username === this.user.username){
          this.setUser(response);
          this.setLoginStatusInLocalStorage(true, response);
        }
        this.updateStatus.next("Değişiklikler Kayit Edildi");
      },
      (error) => {
        console.error("Update error:", error);
        this.updateStatus.next("Değişiklikler kayit edilmedi, lütfen tekrar deneyiniz!")
      }
    )

  }

  public deleteUser(username:String){
    const apiUrl = 'http://localhost:8080/api/users/delete/'+username;

    this.http.delete<User>(apiUrl).subscribe(
      () => {
        this.updateStatus.next("Değişiklikler Kayit Edildi");
      },
      (error) => {
        console.error("Update error:", error);
        this.updateStatus.next("Değişiklikler kayit edilmedi, lütfen tekrar deneyiniz!")
      }
    )
  }

  

  getUpdateStatus(){
    return this.updateStatus.asObservable();
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
