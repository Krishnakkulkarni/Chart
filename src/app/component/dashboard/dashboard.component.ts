import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UserService } from 'src/app/services/userservices/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignalRService } from 'src/app/services/SignalrServices/signal-r.service';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  title = 'ValueAT';
  UserId: string;
  LineChart: any = [];
  value: any = [];
  ManagerCount = [];
  ManagerYear = [];
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



    // this.UserId = localStorage.getItem('userId')
    // this.userServices.Manager(this.UserId).subscribe(data => {
    //   this.value = data;
    //   console.log(this.value);
      
    //   for (let i = 0; i < this.value.length; i+=2) {
    //     this.ManagerCount.push(this.value[i]);
        
    //   }
    //   for (let i = 1; i < this.value.length; i+=2) {
    //     this.ManagerYear.push(this.value[i]);
    //     }

    // });

    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.ManagerYear,
        datasets: [{
          label: 'Number of Managers joined in period of five Years',
          data: this.ManagerCount,
          lineTension: 0.2,
          borderColor: '#3cba9f',
          borderWidth: 1,
          fill: false
        }
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
  public addTransferChartDataListener = () => {
    this.hubConnection.on('data', (res) => {
      console.log("in signal services", res);
      this.value = res;

      // this.value = 0;
      this.ManagerCount.length = 0;
      this.ManagerYear.length = 0;

      for (let i = 0; i < this.value.length; i += 2) {
        this.ManagerCount.push(this.value[i]);

      }
      for (let i = 1; i < this.value.length; i += 2) {
        this.ManagerYear.push(this.value[i]);

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


