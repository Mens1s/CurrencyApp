import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currencies } from '../common/currencies';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  private currencies: any;

  constructor(private http: HttpClient) { }

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
    console.log(this.currencies);
  }

  public async getCurr(): Promise<any> {
    // Convert the Observable to a Promise
    await this.getCurrencies().toPromise();
    return this.currencies;
  }
}
