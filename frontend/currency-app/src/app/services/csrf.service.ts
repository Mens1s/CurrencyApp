import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  constructor(private http: HttpClient) { }

  getCsrfToken(): Observable<string> {
    return this.http.get<{ csrfToken: string }>('http://localhost:8080/api/csrf')
      .pipe(
        map(response => response.csrfToken)
      );
  }
}
