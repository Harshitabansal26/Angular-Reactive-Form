import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Application {
  private baseUrl = environment.apiBaseUrl;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMzhiYjViNGNlNTJlNzZmNjk0YWI4NGQ1N2YxY2ZiOGRmMzExZTgxNDI0YTY3OTQzNmNmM2ViODE0MjQ5NTFlZWJlOTZlN2Q0MjUzNTdjM2MiLCJpYXQiOjE3NTczMjA1OTAuMDMxMTM4LCJuYmYiOjE3NTczMjA1OTAuMDMxMTQxLCJleHAiOjE3ODg4NTY1OTAuMDIzMzMsInN1YiI6IjQiLCJzY29wZXMiOlsiYWRtaW4iXX0.fGuSdgmjzQtH_d1Kv2Cu9285wL556Qfz7DbcrC0zh1EC9frEUe7AmRxuylU8GdlnQPbjZj5P5c1L3ZCM4JAHrbxUBrZioNPDvusrIgPVx0t9LNB9moZu8BzpA-0SAmWJbEr23QCJwDQQV0DRCw0bbVz6hl4WGhgW_-L9PjLFxbr4nhKCNUSCU7o0FwnG7j01aMT_MJmO0IAkHbmXkjsM9eM0IpJACf1m8fa498rWpv4nwwpm2ferp6GDVVKgHRLpw1dI0Ff4B_0kuVjlOgVSeLUswJ-67Lzytpv5NJYP9GMsBIQiyas3lAFL-_IS1BTFNgS8qGXzmaRvbQHBzAyWOg7ZcunUZaVesf9Szl_MFvxZ8tCPp_uLB7fkk04yTmZcZTs_hBpQR5trrp0r-KXLWBgbmFBAFQgebToBj8dX13FeW2y4BllJkgC9H-xRtdQJdErjnscMw0dnooAVRw3w8eixXPrr2_HWUjEhUZT4yJBGmIcrEgLZYXFmBjXASWJJ_LkhYj3k9Fvrf5Y6UfGP9lGzb8anfLJHB2otAAv7cikD6h2PGZyCl1PricZDLr2re3-LRnf8TOkZpOViBJ3GIQzvNNpiyafAQl10sJNSTMOSUzGkFuiHp05zWFNtuFVpusB1yX_C7td97y5VmlBCcvE2ZfcuCzLjkgglEq4POMA';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
  }

  /** -------------------- POST Application -------------------- */
  addApplication(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/onboarding/application`, data, {
      headers: this.getAuthHeaders()
    });
  }

  /** -------------------- Lookups -------------------- */
  getLookups(): Observable<any> {
    const body = { 
      lookups: [
        "countryCode",
        "userType",
        "title",
        "applicationReceiveFrom",
        "gender",
        "parishCounty"
      ] 
    };
    return this.http.post(`${this.baseUrl}/lookups`, body, {
      headers: this.getAuthHeaders()
    });
  }

  getUserLookups(): Observable<any> {
    const body = { 
      lookups: [
        "roles",
        "locations"
      ] 
    };
    return this.http.post(`${this.baseUrl}/user-lookups`, body, {
      headers: this.getAuthHeaders()
    });
  }

  /** -------------------- GET Applications -------------------- */
  getApplications(filters: any = {}): Observable<any[]> {
    let params = new HttpParams()
      .set('page', filters.page || '1')
      .set('limit', filters.limit || '10')
      .set('isAll', filters.isAll !== undefined ? filters.isAll.toString() : 'false');

    if (filters.applicationId) params = params.set('applicationId', filters.applicationId);
    if (filters.businessName) params = params.set('businessName', filters.businessName);
    if (filters.email) params = params.set('email', filters.email);
    if (filters.parish) params = params.set('parish', filters.parish);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.existingRetailer) params = params.set('existingRetailer', filters.existingRetailer);

    return this.http.get<any[]>(`${this.baseUrl}/onboarding/get-application`, {
      params,
      headers: this.getAuthHeaders()
    });
  }
}
