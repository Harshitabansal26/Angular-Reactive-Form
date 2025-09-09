import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Application {
  private baseUrl = environment.apiBaseUrl;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiYWE3NmRjNTE1MzRmODM5MDgyMDE0ZWFlYjg1NWE3Y2E3ZDhkZGQ0NDJjZTk2NjY0NzQ1M2M5MjU1YjAyZGU4NzM2ZTZhZWJmMjcyOWQ2YjkiLCJpYXQiOjE3NTczOTk4MTcuNDQ3NDg5LCJuYmYiOjE3NTczOTk4MTcuNDQ3NDk0LCJleHAiOjE3ODg5MzU4MTcuMzk3NjMxLCJzdWIiOiI0Iiwic2NvcGVzIjpbImFkbWluIl19.Lg8K5KScmjG0x7tS3OUeHXjU9hUtjgyGopt1jzqXeru6GeHojq4hV-i4VY5XkjRluXLK0Yhi3N0zyP4xVDE5AD6vD7DodJzEj6JlsVbZgQ0Lxn8Rcsz-g1TesAtaDXEjuNIFZNoNlVBAAL011gF2ZShpRG3L2ZNz1IXMtXhNSsMOdc4mRvuCeugmPiDnsxc7ikxJiuAJP4Oy_V8sBbzsllkxcT5-pjkn44TJiaqdcf10mJuqDuutNqeURDbIRiDBoajtpIOyNBdubG_O_vZhEX0hLe16zm_yvN3afWHp7BZr87bc0pgSaVUfDCb5olqcmutRoYbSnzGhVk354sLfIOuHuDGB7N7jsDvydNYmbPVRim0ZF6geUdHK_nZQbpbCO7Sc4ZSOuRWExyHZb7-0JOD-XKR3ZLydpBuDfl5ciVtkJ-iv-mBydEceIkvLB8bKx44j48SdW8khN5JFWlchhInOM9y72FE2QZP35bKWoClwUu4xjhBFhr5-tr2M6Ig9LofRFJno-y20zrnOfPhmmHgK_C0idZP79BHc8OvSm2Rp8eK977nXPv2PptEMTKna_3Tf1lpYVpP18qyTqM_sPX68seZhuUZ2tmRiWYzf4B6SOYcJLJ43s91mUAdyIzJmvXAr8bmJjdZfkhznkxZlm6Un0pK6oSswgOFKwN3-C1U';

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
