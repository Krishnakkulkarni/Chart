import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  rooturl = environment.rooturl;

  constructor(public httpclient: HttpClient) { }

  post(url: string, data) {
    return this.httpclient.post(this.rooturl + url, data)
  }
  Get(url: string) {
    return this.httpclient.get(this.rooturl + url)
  }
}
