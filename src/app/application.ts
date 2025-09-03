import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Application {
  private baseUrl = environment.apiBaseUrl;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMTczYWVhMTcxZDk4ZDFjMDdiYWE2ODFiNDFjMTUyOGVhODAzNDM0N2Q2MTBhNTYxMzlkZjM2ZWUwYjg2MjQ5MTk3ZDk4YjlmMTg4ZDgyMzgiLCJpYXQiOjE3NTY5MTA2ODAuOTM1Nzk0LCJuYmYiOjE3NTY5MTA2ODAuOTM1Nzk4LCJleHAiOjE3ODg0NDY2ODAuOTI4MDc1LCJzdWIiOiI0Iiwic2NvcGVzIjpbImFkbWluIl19.gIJ5uDEjUhbL_Y131jxHREyAJ6ifmnwQeX0iuurqfWWp8VgICwXTjfyr9sAKF-pOM0idpjmOp-IQ66QF-6rFhUG96Y6aeID99i-fLOuhQQDfeseqdsI_bKK7LXiWfy4KDxXuZSoSARqN_7EjcXA2DAAVnF8aG8onxpj3O605vBrjlDtdqVGMsGcBGFkkV3UnJK-xEr33gCwp6lJQOi4PPV68cTZxVqi9DdCdGQH9Xkka9H7Ye0_REtRoQuGBnd2QkbOO6XuxAm6HozU_lMKWWY_kDRcjdA9VsYxuElu179aSG24PTeoJgRfLLd5Fffpo9rbTq0QYAa9zzHCNMr1awwrihaEBV_l0IVsuQ4mA6b41TPcFv76G3UOdXmSRi0yLPXCzwXxWyRCTPkf-UIqrfkmRpuHqWvWv6-TOKc5GL0VDAEjFjuGMpmXdvHh6jQMYR-Mzz04apT1Agrolt8ONUx83DgT6c0KJkihwCv6R3epFtlXswl7DmAWY3JRHQxCXTV87nZRvXZJKyvmibhe7BuPPIwG0OiDMuvnLQy3gEOCmWTcD66_XRpzUN7PIocXRhhQB7jMfcDGAB1u0ZGUciMEM_tHl5CdfXsz3JPqQC3AQ7WdB6XUJA_SV2p6A7RrxpMc2cUB4fCl99H3oAtKE66n06MTW_AGAbmWrvBGCCkc';

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
