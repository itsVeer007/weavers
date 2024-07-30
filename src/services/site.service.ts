import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  baseUrl = `${environment.baseUrl}/businessInterface/sites`;

  constructor(private http: HttpClient, private storageSer: StorageService) { }

  listSites() {
    let user: any =   JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/sitesList_2_0';
    let payload = {
      userName : user?.UserName,
      accessToken : 'abc',
      calling_System_Detail: "portal",
    }

    return this.http.post(url, payload);
  }

  getEngineer(id: any) {
    let url = this.baseUrl + '/sites/getEngineerdetails_1_0/' + `${id}`;
    return this.http.get(url);
  }

  getCentralbox(id: any) {
    let url = this.baseUrl + '/sites/getcentralBox_1_0/' + `${id}`;
    return this.http.get(url);
  }

}
