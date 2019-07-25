import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userservices/user.service';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignalRService } from 'src/app/services/SignalrServices/signal-r.service';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-operations-dashboard',
  templateUrl: './operations-dashboard.component.html',
  styleUrls: ['./operations-dashboard.component.scss']
})
export class OperationsDashboardComponent implements OnInit {

  title = 'ValueAT';
  UserId: string;
  LineChart: any = [];
  value: any = [];
  OperationCount = [];
  OperationYear = [];

  private hubConnection: signalR.HubConnection

  constructor(public userServices: UserService, public route: Router,
    public signalRService: SignalRService, private http: HttpClient) { }

  ngOnInit() {

    this.UserId = localStorage.getItem('userId')
    this.startConnection();
    setInterval(() => {
    this.addTransferChartDataListener();
    this.LineChart.update();
    this.startHttpRequest();
    }, 5000)




    // this.userServices.Operation(this.UserId).subscribe(data => {
    //   this.value = data;
    //   console.log(this.value);
    //   for (let i = 0; i < this.value.length; i+=2) {
    //     this.OperationCount.push(this.value[i]);
        
    //   }
    //   for (let i = 1; i < this.value.length; i+=2) {
    //     this.OperationYear.push(this.value[i]);
    //     }
    // });

    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.OperationYear,
        datasets: [{
          label: 'Number of operator joined in period of five Years',
          data: this.OperationCount,
          lineTension: 0.2,
          borderColor: '#3cba9f',
          borderWidth: 1,
          fill: false
        },
        ]
      },
      options: {
        title: { text: "Line Chart", display: true },
        scales: { // xAxes: [{ //   display: true // }],
          yAxes: [{ ticks: { beginAtZero: true } }],
        }
      }
    }
    );
  }
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44328/chart')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  // this.userServices.Analyst(this.UserId).subscribe(data => {
  //   this.value = data;
  //   console.log(this.value);
  public addTransferChartDataListener = () => {
    this.hubConnection.on('data', (res) => {
      console.log("in signal services", res);
      this.value = res;

      // this.value = 0;
      this.OperationCount.length = 0;
      this.OperationYear.length = 0;

      for (let i = 0; i < this.value.length; i += 2) {
        this.OperationCount.push(this.value[i]);

      }
      for (let i = 1; i < this.value.length; i += 2) {
        this.OperationYear.push(this.value[i]);

      }
    });
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:44328/api/chart/get/' + this.UserId)
      .subscribe(res => {
        console.log(res);
      })

  }





  Logout() {
    this.route.navigateByUrl('signin');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}
