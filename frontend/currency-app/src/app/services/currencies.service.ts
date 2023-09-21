import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Currencies } from '../common/currencies';
import { Observable, Subject, catchError, map, throwError, interval, switchMap, startWith, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService{
  private currencies: any;
  private currentTransaction: any;
  private infoStatus = new Subject<string>(); 

  constructor(private http: HttpClient) {
   }
  

  public getCurrencies(): Observable<any> {
    const url = "http://localhost:8080/api/currencies";

    return this.http.get<string>(url, { responseType: 'text' as 'json' }).pipe(
      map((response: string) => {
        // Extract and parse the JSON part of the response
        const startIndex = response.indexOf('{');
        const endIndex = response.lastIndexOf('}');

        if (startIndex !== -1 && endIndex !== -1) {
          const jsonString = response.substring(startIndex, endIndex + 1);
          const jsonData = JSON.parse(jsonString);
  
          this.setCurrencies(jsonData);
          return jsonData;
        }
      }),
      catchError((error) => {
        console.error("Error:", error);
        return throwError(error);
      })
    );
  }

  private setCurrencies(curr: any) {
    this.currencies = curr;
  }

  public async getCurr(): Promise<any> {
    // Convert the Observable to a Promise
    await this.getCurrencies().toPromise();
    return this.currencies;
  }

  public getCurrNUpdated(){
    return this.currencies;
  }

  public setUpdatedInformations(info:any){
    this.infoStatus.next(info);
    this.currentTransaction= info;
  }

  public getInfoStatus(){
    return this.infoStatus;
  }

  public getUpdatedInformations(){
    return this.currentTransaction;
  }

}
