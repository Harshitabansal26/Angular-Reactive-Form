import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class Application {
  private apiUrl = 'http://localhost:3000/applications'; // db.json via json-server

  constructor(private http: HttpClient) {}

  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addApplication(app: any): Observable<any> {
    return this.http.post(this.apiUrl, app);
  }
}

