import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Application {
  private baseUrl = environment.apiBaseUrl;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiNzEwNjk1YzliNzI2ZWFhZTIxMmRmZjUyNTQ1ZjZlNjlhOGI3MzE2NzlmNjBhYmJhYzFiYjc4MWQ5ZDIxZGNiNzY5OTBhMGVlMmMwMjRiNjciLCJpYXQiOjE3NTY4ODE0MDUuNTkyMTk4LCJuYmYiOjE3NTY4ODE0MDUuNTkyMjAzLCJleHAiOjE3ODg0MTc0MDUuNTMyMzQ4LCJzdWIiOiI0Iiwic2NvcGVzIjpbImFkbWluIl19.I0EF8Zq2fEacxtbP-7faYrQyAGpIDNodnVyVSSXyOf1-FI09-FZZ4Mo_dgfc7aZLSoiBhisdzjfG9yKVN3Lftcg7l-HmhUE4j5Egl3SSbfywaW8bG7jeG2UgFD9WX2CuUXvHVHBKFp3FNjAB8SuSaNydLkcbp0eZc5XYgfdeEjgRsoaJuK0KaH3TODxtcMzyt8hIvPrKbIYAn7oYFuLJyE4JYcv0zOzww7aoyv15JoX6RpN3xJdO29wAbedIv6rI0iiyj2WYV32vdVm5ZdWb4CvRK4P20ay0Aw01bgQGUoPfnjPD6ekNvmrc2vq-bpqxHZDgjH361sXEo8lwxpfopHGcVHlNrQPOYR2sqdnv-17maj8L0T2uIklTLOOhsmy94oYIKMiezNqAdipGAZ51JlfRNowmsAEycfY41Wf5WcluRLc5M285bMSMY16G-mP85M4s2r3avhVzdwZRO7qkyj2C9COZVQt_peagYElH62SVglORZjwe0BqFveQ45ca2a8HFrg9B3f5AGCjaqo84fSHyN8Z9WwBlIzxs6UywNX06T5_P_sabSFVGFWANtLQFW5SsjcGXWmtqyusoXCPKRdOtnJd68d_FmfzEHCySHwMLabrsyT4LbdwaErqbzWEvv4WluDYDko6KRG_p-4-tQEtyVr3NQrIR35UaUf3Jt2A';

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
