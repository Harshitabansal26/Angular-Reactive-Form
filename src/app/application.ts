// src/app/application.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Application {
  private baseUrl = environment.apiBaseUrl;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiYjJlMmY1N2EwMjcwNDExY2Y5MTc0ZmQ2MzMxNzBkMDhlMjhkNjkxZDc4NzUxY2NmMDhjZTFkMWY0NmU0MDcyN2JlNDYwMmNkYmY2OWQ1ZjkiLCJpYXQiOjE3NTY3MTMwNjguODg0ODg4LCJuYmYiOjE3NTY3MTMwNjguODg0ODkyLCJleHAiOjE3ODgyNDkwNjguODc3MzM2LCJzdWIiOiI0Iiwic2NvcGVzIjpbImFkbWluIl19.ZrTUTGq4buFGuVN9dg8Le8sMPfAQbU9lqkBq3hS-1HdUlbGJENLp7WTAjDUbBs1oAySFo0hKBO8GlgpSzRBwJNg0CZy1OYTNzHeuf2vEucpXltFUj1d_SIb8bMMyf9klATM-9AhyCyP7PIwqbR-ZOISYgSco8sA0NZQ7HGhocLdMElcHkXHZJYS9SfM6Iqv5pL576OYkmy1Lty_x68epSvDI-iy-O6YnWrTsW8PQIvbfPO23xkfmSdrwR7NcxSo5mVPbun-KnGDdCguHCw8rN_hBlwsjAneR407Hqc_N3j2SITX5Zn2fBSLqbb8dZbiK4mEbSn_EVqsiWqAxR_mkjdFepHtNSIThM2xLYQ2I0skWZhnVFJiMpi2OhBzlRXDMo_yMOwliuUiG5CC4CKGRENvAz7-yWUb6wFQTeNNhX-8qe4eW_KyjosuczRTI8pZY2_lqWcRn1i0GGikfDnx3SbZKt_ysg9UacVFR5HgRhSO4nV_m3uB47ks0CcZqIvwcQhi5iU8t5EopcfmB_L4ArPuvX_W1kfCHlvNzGYK-rbZxlPQxgecq_EpPGeM8Y6FOt8pR0pxdV40TEq2HEXJieJbl-s6bs7Xkwc8Wzl0HwVA6tTPMQkO_gn-o4r5cPe6NfPW7dohC6k4CV4VT54evuB_wCWx-jZt4q97zaPxjNEw'; 

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
    if (filters.mobile) params = params.set('mobile', filters.mobile);
    if (filters.parish) params = params.set('parish', filters.parish);

    return this.http.get<any[]>(`${this.baseUrl}/onboarding/get-application`, {
      params,
      headers: this.getAuthHeaders()
    });
  }
}
