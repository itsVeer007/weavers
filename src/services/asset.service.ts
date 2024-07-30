import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe, formatDate } from '@angular/common';

import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  assets$ = new BehaviorSubject(null);

  constructor(private http: HttpClient, private date: DatePipe) { }

  baseUrl = `${environment.baseUrl}/proximityads`;
  baseUrl1 = 'http://192.168.0.109:8000';

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'multipart/form-data'
  //   })
  // }

  // download(id: any) {
  //   let url = this.baseUrl + '/getAssetFile_1_0'

  //   let myObj = {
  //     'assetName': 'BS-C001.mp4',
  //     'deviceId': id,
  //   }
  //   return this.http.get(url, {params: myObj});
  // }

  listAssets() {
    let url = this.baseUrl + "/listAssets_1_0";
    return this.http.get(url);
  }

  listAssets1(payload: any) {
    let url = this.baseUrl + "/listAssets_1_0";
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }

    return this.http.get(url, {params: params});
  }

  getAssetBySiteId(siteId: any) {
    let url = this.baseUrl + "/listAssets_1_0";

    let myObj = {
      'siteId': siteId
    };

    return this.http.get(url, { params: myObj });
  }

  getAssetByDevId(devId: any) {
    let url = this.baseUrl + "/listAssets_1_0";

    let myObj = {
      'deviceId': devId
    };

    return this.http.get(url, { params: myObj });
  }


  addAsset(payload: any, file: any) {
    let user = JSON.parse(localStorage.getItem('user')!);
    let deviceData = JSON.parse(localStorage.getItem('add_body')!);
    let formData: any = new FormData();

    /**file */
    formData.append('file', file);

    /**asset data */
    let assetData = {
      'deviceId': deviceData?.deviceId,
      'deviceModeId': payload?.asset?.deviceModeId,
      'playOrder': payload?.asset?.playOrder,
      'createdBy': user?.UserId,
      'name': payload?.asset?.name,
      'splRuleId': payload?.asset?.splRuleId,
      'fromDate': payload?.asset?.fromDate ? formatDate(payload?.asset?.fromDate, 'yyyy-MM-dd', 'en-us') : formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'toDate': payload?.asset?.toDate ? formatDate(payload?.asset?.toDate, 'yyyy-MM-dd', 'en-us') : '2999-12-31'
    }
    const ass = new Blob([JSON.stringify(assetData)], {
      type: 'application/json',
    });
    formData.append('asset', ass);

    /**name params */
    let paramData = {
      'timeId': payload?.nameParams?.timeId,
      'tempId': payload?.nameParams?.tempId,
      'maleKids': payload?.nameParams?.maleKids,
      'femaleKids': payload?.nameParams?.femaleKids,
      'maleYouth': payload?.nameParams?.maleYouth,
      'femaleYouth': payload?.nameParams?.femaleYouth,
      'maleAdults': payload?.nameParams?.maleAdults,
      'femaleAdults': payload?.nameParams?.femaleAdults,
      'vehicles': payload?.nameParams?.vehicles,
      'persons': payload?.nameParams?.persons
    }
    const param = new Blob([JSON.stringify(paramData)], {
      type: 'application/json',
    });
    formData.append('nameParams', param);

    let url = this.baseUrl + "/createAssetforDevice_1_0";
    return this.http.post(url, formData);
  }

  // createDeviceAdd(payload: any) {
  //   let url = this.baseUrl + '/createDeviceAdsInfo_1_0';
  //   return this.http.post(url, payload)
  // }

  modifyAssetForDevice(payload: any) {
    let url = this.baseUrl + '/modifyAssetForDevice_1_0';
    return this.http.put(url, payload);
  }

  updateAssetStatus(id: any, payload: any) {
    let url = this.baseUrl + "/updateAssetStatus_1_0";

    let myObj = {
      'id': id,
      'status': payload.status,
      'modifiedBy': payload.modifiedBy
    }

    return this.http.put(url, myObj);
  }


  /* devices */

  listDeviceAdsInfo() {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';
    return this.http.get(url);
  }

  listDeviceAdsInfo1(payload: any) {
    let url = this.baseUrl + "/listDeviceAdsInfo_1_0";
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }

    return this.http.get(url, {params: params});
  }

  listDeviceBySiteId(siteId: any) {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';
    let params = new HttpParams().set('siteId', siteId)

    return this.http.get(url, {params: params});
  }

  listDeviceByDeviceId(deviceId: any) {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';
    let params = new HttpParams().set('deviceId', deviceId)

    return this.http.get(url, {params: params});
  }

  getHealth() {
    let url = this.baseUrl + '/getHealth_1_0';
    // var payload = {
    //   'deviceId': deviceId
    // }

    return this.http.get(url);
  }

  updateRebootDevice(id: any) {
    let url = this.baseUrl + '/updateRebootDevice_1_0';
    const params = new HttpParams().set('deviceId', id.toString()).set('modifiedBy', 1);

    return this.http.put(url, null, { params: params });
  }

  createDeviceandAdsInfo(payload: any) {
    let url = this.baseUrl + '/createDeviceandAdsInfo_1_0';
    return this.http.post(url, payload);
  }

  updateDeviceAdsInfo(payload: any) {
    let url = this.baseUrl + '/updateDeviceAdsInfo_1_0';
    return this.http.put(url, payload);
  }

  deleteDeviceAdsInfo(payload: any) {
    let url = this.baseUrl + '/deleteDeviceAdsInfo_1_0';

    let myObj = {
      'deviceId': payload,
      'modifiedBy': payload
    }
    return this.http.delete(url, {body: myObj})
  }


  /* advertisement reports */

  reportUrl = 'http://192.168.0.137:8080';

  list() {
    let url = this.reportUrl + "/search";
    return this.http.get(url);

  }

  wifiList() {
    let url = this.reportUrl + "/connected_details";
    return this.http.get(url);
  }


  updateProductMaster(payload: any) {
    let url = this.reportUrl + '/updatingproduct_1_0';
    return this.http.put(url, payload)
  }

  deleteProduct(payload: any) {
    let url = this.reportUrl + `/deletion_1_0?Id=${payload.id}`;

    return this.http.delete(url);
  }


  filterReports(payload: any) {
    let url = this.reportUrl + '/search';
    let params = new HttpParams();

    if(payload.siteId) {
      params = params.set('siteId', payload.siteId)
    }
    if(payload.deviceId) {
      params = params.set('deviceId', payload.deviceId)
    }
    if(payload.from_date) {
      params = params.set('from_date', payload.from_date)
    }
    if(payload.to_date) {
      params = params.set('to_date', payload.to_date)
    }

    return this.http.get(url, {params: params})
  }


  filteBody(payload: any) {
    let url = this.reportUrl + `/getListBySearchPM_1_0?`;
    return this.http.get(url, {params: payload});
  }



  // wifi Analytics
  totaldevices() {
    let url = this.baseUrl1 + `/get_data`;
    return this.http.get(url);
  }

  // GetActiveDevices() {
  //   let url = this.baseUrl1 + `/GetActiveDevices`;
  //   return this.http.get(url);
  // }

  // GetInactiveDevicesToday() {
  //   let url = this.baseUrl1 + `/GetInactiveDevicesToday`;
  //   return this.http.get(url);
  // }

}
