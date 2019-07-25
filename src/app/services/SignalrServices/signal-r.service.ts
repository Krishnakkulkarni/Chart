import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";


@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  // public data = [];
 
  // private hubConnection: signalR.HubConnection
   
  //   public startConnection = () => {
  //     this.hubConnection = new signalR.HubConnectionBuilder()
  //                             .withUrl('https://localhost:44328/chart')
  //                             .build();
   
  //     this.hubConnection
  //       .start()
  //       .then(() => console.log('Connection started'))
  //       .catch(err => console.log('Error while starting connection: ' + err))
  //   }
   
  //   public addTransferChartDataListener = () => {
  //     this.hubConnection.on('data', (res) => {
  //       console.log("in signal services",res);
        
  //       this.data = res;
        
  //     });
  //   }
    
    
  constructor() { }

  
}
