import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UserService } from 'src/app/services/userservices/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from 'src/app/services/SignalrServices/signal-r.service';
import * as signalR from '@aspnet/signalr';
import { ExcelService } from 'src/app/services/excelServices/excel.service';

@Component({
  selector: 'app-analysts-dashboard',
  templateUrl: './analysts-dashboard.component.html',
  styleUrls: ['./analysts-dashboard.component.scss']
})

export class AnalystsDashboardComponent implements OnInit {

  title = 'ValueAT';
  UserId: string;
  LineChart: any = [];
  value: any = [];

  AnalystCount = [];
  AnalystYear = [];
  exceldata = [];


  excelAnalystdata = [];
  excelManagerdata = [];
  excelOperationdata = [];
  excelSalesdata = [];

  private hubConnection: signalR.HubConnection

  // private startHttpRequest

  constructor(public userServices: UserService, public route: Router,
    public signalRService: SignalRService, private http: HttpClient,
    public excelService: ExcelService) { }




  ngOnInit() {
    this.UserId = localStorage.getItem('userId')
    console.log(this.UserId);

    this.userServices.AnalystDataExcel(this.UserId).subscribe((data: any) => {
      console.log(data);
      this.exceldata = data;

      // console.log(data[0]);
      // this.excelAnalystdata = data[0];

      // console.log(data[1]);
      // this.excelManagerdata = data[1];

      // console.log(data[2]);
      // this.excelOperationdata = data[2];

      // console.log(data[3]);
      // this.excelSalesdata = data[3];

    }
    );


    this.startConnection();
    setInterval(() => {
      this.addTransferChartDataListener();
      this.LineChart.update();
      this.startHttpRequest();
    }, 3000)


    // this.userServices.Analyst(this.UserId).subscribe(data => {
    //   this.value = data;
    //   console.log(this.value);
    // public addTransferChartDataListener = () => {
    //   this.hubConnection.on('data', (res) => {
    //     console.log("in signal services", res);
    //     this.value = res;

    //     for (let i = 0; i < this.value.length; i += 2) {
    //       this.AnalystCount.push(this.value[i]);

    //     }
    //     for (let i = 1; i < this.value.length; i += 2) {
    //       this.AnalystYear.push(this.value[i]);

    //     }
    //   });
    // }
    this.LineChart = new Chart
      ('lineChart', {
        type: 'line',
        data: {
          labels: this.AnalystYear,
          datasets: [
            {
              label: 'Number of Analysts joined in period of five Years',
              data: this.AnalystCount,
              lineTension: 0.2,
              borderColor: 'green',
              borderWidth: 1,
              fill: false
            }
          ]
        },
        options: {
          title: { text: "Line Chart", display: true },

          scales: { // xAxes: [{   display: true  }],
            yAxes: [{ ticks: { beginAtZero: true } }],
          }
        }
      });
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
      this.AnalystCount.length = 0;
      this.AnalystYear.length = 0;

      for (let i = 0; i < this.value.length; i += 2) {
        this.AnalystCount.push(this.value[i]);

      }
      for (let i = 1; i < this.value.length; i += 2) {
        this.AnalystYear.push(this.value[i]);

      }
    });
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:44328/api/chart/get/' + this.UserId)
      .subscribe(res => {
        console.log(res);
      })

  }

  exportAsXLSX(): void {
    console.log(this.exceldata);

    this.excelService.exportAsExcelFile(this.exceldata, 'RoleDataList');

  }

  Logout() {
    this.route.navigateByUrl('signin');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

}
