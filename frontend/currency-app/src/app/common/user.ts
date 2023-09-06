export class User {
    id: number;
    username: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
    balance: string;
    wallet: Wallet; // Assuming Wallet is another model class
    transactions: Transaction[]; // Assuming Transaction is another model class
  
    constructor() {
      // Initialize any default values here if needed
      this.id = 0;
      this.username = '';
      this.name = '';
      this.surname = '';
      this.email = '';
      this.phone = '';
      this.password = '';
      this.balance = '';
      this.wallet = new Wallet();
      this.transactions = [];
    }
  }
  
  export class Wallet {
    id: number;
    balancesJson: string;
    user_id: number;
    
    constructor() {
      this.id = 0;
      this.balancesJson = '';
      this.user_id = 1;
    }
  
    // Convert JSON string to a Map object
    public getBalances(): Map<string, number> {
      return JSON.parse(this.balancesJson);
    }
  
    // Convert a Map object to a JSON string
    public setBalances(balances: Map<string, number>): void {
      this.balancesJson = JSON.stringify(balances);
    }
  }
  
  
  export class Transaction {
    id: number;
    user_id: number;
    volume_of_coin: string;
    coin_name: string;
    volume_of_dolar: string;
    type: string;
    
    constructor() {
      this.id = 0;
      this.user_id = 0;
      this.volume_of_coin = '';
      this.coin_name = '';
      this.volume_of_dolar = '';
      this.type = '';
    }
  }