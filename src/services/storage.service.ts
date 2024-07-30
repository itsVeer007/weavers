import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
// import { escape } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // secretKey: any = '';

  // private encrypt(txt: string): string {
  //   return CryptoJS.AES.encrypt(txt, this.secretKey).toString();
  // }

  // private decrypt(txtToDecrypt: string) {
  //   return CryptoJS.AES.decrypt(txtToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
  // }

  // public saveData(key: string, value: any) {
  //   localStorage.setItem(key, this.encrypt(JSON.stringify(value)));
  // }

  // public getData(key: any) {
  //   return this.decrypt(JSON.parse(localStorage.getItem(key)!));
  // }

  private encrypt(enKey: any, enValue: any) {
    let data = ({key: enKey, value: enValue});
    localStorage.setItem(enKey, JSON.stringify(data));
  }

  public saveData(key: any, value: any) {
    let secretKey: string = "";
    let data = btoa(escape(JSON.stringify(value)));
    if(key == "user") {
      secretKey = "ABC123";
      return this.encrypt(secretKey, data);
    }
  }

  private decrypt(key: any) {
    let res = JSON.parse(localStorage.getItem(key)!);
    if(res) {
      return JSON.parse(unescape(atob(res.value)));
    } else {
      return null;
    }
  }

  public getData(key: any) {
    let secretKey: string = "";
    if(key == "user") {
      secretKey = "ABC123";
      return this.decrypt(key);
    }
  }

  public set(name: any, data: any) {
    // let x = btoa(encodeURIComponent(JSON.stringify(data)));
    // localStorage.setItem(name, x);
    localStorage.setItem(name, JSON.stringify(data));
  }

  public get(data: any) {
    // let x: any = localStorage.getItem(data);
    // return JSON.parse(decodeURIComponent(atob(x)));
    return JSON.parse(localStorage.getItem(data)!);
  }




  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
