import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Application {
  private baseUrl = environment.apiBaseUrl;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiYmNmNzE5ZjJkNmZhOTkzODkzNWQ0MmE2YzYxNWM5OGM5ZjVlM2JkOGFmNWUwOTQzNGZkZWI1ZGQzNTMzMjUwOTQyNzMwZmRjZDVmN2Q3NzAiLCJpYXQiOjE3NTcwNjEzMzUuNjY0OTY3LCJuYmYiOjE3NTcwNjEzMzUuNjY0OTcsImV4cCI6MTc4ODU5NzMzNS42MzY1NTUsInN1YiI6IjQiLCJzY29wZXMiOlsiYWRtaW4iXX0.E5Px9c_RnDPLyvROCwLwNHw6qbFUwXCENqRBJxvoI5leohI5qyYTJbOVyGo9guTUPdyqSDArt6hJXqqGHtXF_Krr_wW-FIDz6hTd2QkVLX1H5AJHpqUCpEvNppOrQwYSbDzXNAw7hn3xF-z6kKR4K9p4IagV2_ykjWas1jWFG1YXUhb0ljF5jVpglp3X26kLlztZC93nkdolpLjnaZ-13X4rn3erdx4SAxiFP7Ru9ENHQlf7AVV9AOKzVL6u3fK9sOvEB67n4zKuiYa1SOm8K3DoPTgkUMz5G59PbbnjzDRx5CvFkHdNicXKGAThMWxgqADQbOWj6UX1rMGbq27FYgja2G2sSTbUfS9UH5FM7xycf585hqQlafF9v1NZaWUn2_EzhYXGVR1-7Eurjd6_kMRfqt7yOw9enyV_pvXxqe2mER-MquDnWV7wK0pg0nS0GESLffhxcndvSM3k0HVVF1TETrXGw-_IJEaDjzW8s5FJoSakP-GJeC9ohBXY5fXBKCc_dJ2i9fTlH8rcCrwAO2ma6tNu58GfMF0IUzpQ_pXaA1NJINOqomous-kv0eGMbm4WDtzLMEBEr6MWtejggGgB1vJmXzTzMNn4anP6mDgVqCr4IU6j4ULQkr0AeDfBUglyXTsb5KaP0hEPKZPPldvC6KmST7O6xxBLsAT2bqc';

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
