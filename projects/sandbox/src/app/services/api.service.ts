import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiFilter, LaunchData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = environment.apiUrl;
  constructor(private readonly httpClient: HttpClient) { }

  getLaunchesData(data: ApiFilter): Observable<LaunchData[]> {
    let params = new HttpParams().set('limit', "100");
    if (data.year) {
      params = params.append('launch_year', data.year);
    }
    if (data.launchSuccess) {
      params = params.append('launch_success', data.launchSuccess);
    }
    if (data.landingSuccess) {
      params = params.append('land_success', data.landingSuccess);
    }

    return this.httpClient.get<LaunchData[]>(this.baseUrl, { params });
  }

  getCountries() {
    return this.httpClient.get<any>('https://restcountries.com/v3.1/all')
  }
}
