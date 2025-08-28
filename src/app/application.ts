import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Application {
  private apiUrl = 'http://localhost:3000/applications';

  constructor(private http: HttpClient) {}

  // POST - add a new application
  addApplication(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // GET with clean query params
  getApplications(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();

    if (filters.email) params = params.set('personalDetails.email', filters.email);
    if (filters.businessName) params = params.set('businessInformation.businessName', filters.businessName);
    if (filters.mobile) params = params.set('personalDetails.cellphone', filters.mobile);
    if (filters.parish) params = params.set('businessInformation.parish', filters.parish);

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
