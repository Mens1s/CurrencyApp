import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { UserService } from 'src/app/services/user.service';

declare var TradingView: any; // Declare TradingView as a global variable
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css', '../dashboard/css/sb-admin-2.min.css', '../dashboard/vendor/fontawesome-free/css/all.min.css']
})
export class TransactionComponent implements AfterViewInit {
  public transactions: any[] = [];
  public transactionsArray: any[][] = [];
  public reversedTransactionsArray: any[][] = [];

  public definedCurr: any;
  public currName: any;
  public currPrice: number = 0;

  public miktar: number = 0;
  public dolarKarsiligi: number = 0;
  public miktar_coin: number = 0;
  public dolarKarsiligi_coin: number = 0;

  public user = new User();

  public affordableStatusClass: string | null = null;

  public transactionStatus: string | null = null;
  public transactionStatusClass : string | null = null;

  public transactionStatus_coin : string | null = null;

  public balance : number = 0;
  public availableCurrency : number = 0;

  constructor(private userService: UserService, 
    private currService: CurrenciesService,
    private router: Router) {}

  ngAfterViewInit(): void {
    const info : string= this.currService.getUpdatedInformations();
    this.user = this.userService.getUser();
    this.balance = +this.user.balance;
    
    this.update(info);

    this.currService.getInfoStatus().subscribe((info) => {
      this.update(info);
      this.loadTradingViewScript();
      this.getCryptoTransactions(info);
    })
 
    this.userService.getTransactionStatus().subscribe((transactionStatus) => {
      this.transactionStatus = transactionStatus;

      if(this.transactionStatus == "İşlem Başarılı!"){
        this.transactionStatusClass = "alert-success";
        this.user = this.userService.getUser();
        this.availableCurrency = (+this.availableCurrency)+ (+this.miktar);
        this.balance = +this.user.balance-this.miktar*this.currPrice;
      }else{
        this.transactionStatusClass = "alert-danger"
      }
  
    });

    this.userService.getTransactionStatus_coin().subscribe((transactionStatus_coin) => {
      this.transactionStatus_coin = transactionStatus_coin;

      if(this.transactionStatus_coin == "İşlem Başarılı!"){
        this.transactionStatusClass = "alert-success";
        this.user = this.userService.getUser();
        this.availableCurrency = +this.availableCurrency-this.miktar_coin;
        this.balance = +this.user.balance+this.miktar_coin*this.currPrice;
        console.log(this.balance)
      }else{
        this.transactionStatusClass = "alert-danger"
      }
      
    });

    this.currService.getCurrenciesBuySellStatus().subscribe((data) => {
      this.transactionsArray = JSON.parse(data);
      this.reversedTransactionsArray = this.transactionsArray.slice().reverse();

    })

    this.loadTradingViewScript();
    this.getCryptoTransactions(this.currName);
    
  }

  loadTradingViewScript() {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      // The script has loaded, you can now initialize the TradingView widget here
      this.initializeTradingViewWidget();
    };

    document.head.appendChild(script);
  }

  initializeTradingViewWidget() {
    // Initialize the TradingView widget here
    new TradingView.widget({
      "width": 980,
      "height": 610,
      "symbol": this.currName+"USD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "enable_publishing": true,
      "allow_symbol_change": true,
      "container_id": "tradingview_abc2e"
    });
  }

  private update(info:string){
    this.currName = info.split(',')[0]
    this.currPrice = +info.split(',')[1]

    const jsonObject = JSON.parse(this.user.wallet.balancesJson)
    
    const myMap = new Map(Object.entries(jsonObject));
    if(isNaN(this.currPrice)){
      this.router.navigate([""])
    }
    else if(!(myMap.get(this.currName) == undefined)) {
      this.availableCurrency = +(myMap.get(this.currName) as number);
    }
  }

  calculateDollarEquivalent() {
    
    this.dolarKarsiligi = this.miktar * this.currPrice;

    if(this.dolarKarsiligi > +this.user.balance){
      this.affordableStatusClass = "alert-danger";
    }else{
      this.affordableStatusClass = "alert-success";
    }
  }

  calculateDollarEquivalent_coin() {
    
    this.dolarKarsiligi_coin = this.miktar_coin * this.currPrice;

    if(this.miktar_coin > +this.availableCurrency){
      this.affordableStatusClass = "alert-danger";
    }else{
      this.affordableStatusClass = "alert-success";
    }
  }

  getCryptoTransactions(cryptoName: string): void {
    this.currService.getTransactionsByCryptoName(this.currName);
  }

  getBackgroundColor(type: string): string {
    // Define your logic to determine the background color based on the type
    // For example, if the type is 'buy', set it to green; if 'sell', set it to red.
    return type === 'buy' ? 'green' : (type === 'sell' ? 'red' : '');
  }

  public buy(){
    this.userService.buy(this.miktar+"", this.currName, (this.miktar*this.currPrice)+"" )
  }

  public sell(){
    this.userService.sell(this.miktar_coin+"", this.currName, (this.miktar_coin*this.currPrice)+"" )
  }
}
