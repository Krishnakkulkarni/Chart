import { Injectable } from '@angular/core';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {


  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string) {

    console.log(json);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[0]);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[1]);
    const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[2]);
    const worksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[3]);

    const workbook: XLSX.WorkBook = {
      Sheets: {
        'worksheet': worksheet,
        'worksheet1': worksheet1,
        'worksheet2': worksheet2,
        'worksheet3': worksheet3
      },
      SheetNames: ['worksheet', 'worksheet1', 'worksheet2', 'worksheet3']
    };


    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
