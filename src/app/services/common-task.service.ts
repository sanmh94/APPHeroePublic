import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonTaskService {

  constructor() { }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getActualDate(){
    const dt = new Date();
    const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

    return (`${
        padL(dt.getMonth()+1)}/${
        padL(dt.getDate())}/${
        dt.getFullYear()}_${
        padL(dt.getHours())}:${
        padL(dt.getMinutes())}:${
        padL(dt.getSeconds())}`
    );
  }

   downloadJSONAsCSV(jsonData,tittle) {
      let csvData = this.jsonToCsv(jsonData);
      let blob = new Blob([csvData], { type: 'text/csv' });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = tittle + '_' + this.getActualDate() + '.csv';
      document.body.appendChild(a);
      a.click();
  }

  jsonToCsv(jsonData) {
    let csv = '';
    let headers = Object.keys(jsonData[0]).map(header=> header);
    csv += headers.join(';').toUpperCase() + '\n';
    for (let index = 0; index < jsonData.length; index++) {
      const row = jsonData[index];
      let data = headers.map(header => JSON.stringify(row[header])).join(';');
      csv += data + '\n';
    }
    return csv;
  }

}
