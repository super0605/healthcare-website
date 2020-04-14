import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  get<T>(url: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${url}`, { params });
  }

  post<T, D>(url: string, data: D): Observable<T> {
    return this.http.post<T>(`${url}`, JSON.stringify(data), this.httpOptions);
  }

  put<T, D>(url: string, data: D): Observable<T> {
    return this.http.put<T>(`${url}`, JSON.stringify(data), this.httpOptions);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${url}`, this.httpOptions);
  }
}
