import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction, User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', './css/sb-admin-2.min.css', './vendor/fontawesome-free/css/all.min.css']

})
export class DashboardComponent implements OnInit {
  public user = new User();
  public transactionNumber = 0;
  public curr : any;

  constructor(private userService: UserService, private currService: CurrenciesService, private authService: AuthService, private router: Router) {
    if(!this.authService.isLoggedIn()){
      router.navigate([""]);
    }
    
    this.user = userService.getUser();

    this.curr = currService.getCurr();
    
    if (this.user) {
      this.transactionNumber = this.user.transactions ? this.user.transactions.length : 0;
    } else {
      this.transactionNumber = 0;
    }

    console.log(this.curr);
  }

  public setCurr(curr: any){
    this.curr = curr;
  }
  ngOnInit(): void {
    this.loadCurr();
    console.log(this.curr);
  }
  
  async loadCurr(){
    this.curr = await this.currService.getCurr();
  }

  public logout(){
    this.userService.logout();
  }
}
