import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { UserService } from 'src/app/services/user.service';
import { interval, switchMap, startWith, take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']

})
export class DashboardComponent implements OnInit {
  public user = new User();
  public transactionNumber = 0;
  public curr : any;
  public currenciesUpdate: string | null = null;

  constructor(private userService: UserService, 
              private currService: CurrenciesService, 
              private authService: AuthService, 
              private router: Router, 
              private route: ActivatedRoute) {
                
    if(!this.authService.isLoggedIn()){
      router.navigate([""]);
    }
    
    this.user = userService.getUser();

    this.curr = currService.getCurr();
    
    if (this.user) {
      this.transactionNumber = this.user.transactions ? this.user.transactions.length : 0;
      if(this.transactionNumber > 0){
        this.user.transactions.forEach((number, index) => {
          const parsedValue = parseFloat(number.volume_of_dolar);
          const roundedValue = isNaN(parsedValue) ? 0 : parsedValue.toFixed(2);
          this.user.transactions[index].volume_of_dolar = roundedValue.toString();
        })
      }
    } else {
      this.transactionNumber = 0;
    }

  }

  public setCurr(curr: any){
    this.curr = curr;
  }
  ngOnInit(): void {
    this.loadCurr();
  
    this.router.navigate(["dashboard"])
    interval(5000)
    .pipe(
      startWith(0),
      switchMap(() => this.currService.getCurrencies().pipe(take(1)).toPromise())
    )
    .subscribe((data) => {
      this.curr = data;
    });
  }

  async loadCurr(){
    this.curr = await this.currService.getCurr();
  }

  public logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }
  public doSearch(value:string){
    this.goTransactionPage(value);
  }
  public goTransactionPage(value: any) {
    const info = value+','+this.curr[value];

    this.currService.setUpdatedInformations(info);
    
    this.router.navigate(['dashboard', value],
    {
      skipLocationChange: true,
    })

  }

}
