import { Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Chart } from 'chart.js/auto'
import { CurrenciesService } from 'src/app/services/currencies.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements AfterViewInit {
  @ViewChild('pieChart') private chartRef!: ElementRef;
  @ViewChild('pieChartPrice') private chartRefPrice!: ElementRef;

  public user = new User();
  public transactionNumber = 0;
  public transactionsPerPage = 10;
  public currentPage = 1;
  public curr : any;

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private currService : CurrenciesService) {
    if(!this.authService.isLoggedIn()){
      router.navigate([""]);
    }
    
    this.user = userService.getUser();


    if (this.user) {
      this.transactionNumber = this.user.transactions ? this.user.transactions.length : 0;

    } else {
      this.transactionNumber = 0;
    }

    this.user.transactions.sort((a, b) => b.id - a.id);
  }

  async ngAfterViewInit() {
    this.curr = await this.currService.getCurr();
    this.createPieChart();
  }

  private createPieChart(): void {

    const colors = [
      '#FF5733',
      '#33FF57',
      '#5733FF',
      '#FF33F6',
      '#33FFFF',
      '#FFFF33',
      '#33FFC1',
      '#FF3366',
      '#3366FF',
      '#33FF99',
      '#AA00BB', 
      '#BB00AA',
      '#DC00AF', 
      '#FF00EC', 
      '#10FFDC'  
    ];

    const data = JSON.parse(this.user.wallet.balancesJson);
    const labelList = [];
    const stockList = [];
    const priceList = [];
    const colorList = [];

    for(const key in data){
      const price = data[key];

      if(price > 0){
        labelList.push(key);
        stockList.push(price);

        if(key != "dollar")
          priceList.push(price * this.curr[key]);
        else 
          priceList.push(price);

        const colorIndex = labelList.length % colors.length;
        colorList.push(colors[colorIndex]);
      } 
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    const ctx2 = this.chartRefPrice.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labelList,
        datasets: [{
          data: stockList,
          backgroundColor: colorList
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: labelList,
        datasets: [{
          data: priceList,
          backgroundColor: colorList
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.transactionsPerPage;
  }

  get endIndex(): number {
    return this.currentPage * this.transactionsPerPage;
  }

  next() {
    if(this.currentPage < this.totalPages){
      this.currentPage++;
    }
  }

  previous(){
    if(this.currentPage > 1){
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.user.transactions.length / this.transactionsPerPage);
  }
}
