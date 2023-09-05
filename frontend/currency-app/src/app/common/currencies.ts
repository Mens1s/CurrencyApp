export class Currencies {
    id: number;
    datas: { [key: string]: number }; // datas should be an object with string keys and number values
  
    constructor() {
      // Initialize any default values here if needed
      this.id = 0;
      this.datas = {};
    }
  }