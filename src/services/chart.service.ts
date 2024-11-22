import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

import Histogram from 'highcharts/modules/histogram-bellcurve';
Histogram(Highcharts);

import highcharts3D from 'highcharts/highcharts-3d';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
highcharts3D(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);
// import * as newdata from './data';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  options:any;
  constructor(
    private http: HttpClient
  ) { }


  createchart(charttype:any,threeD:any, title:any, data:any, elementid:any, antype:any){
    this.options = {
      // colors: ['#2D95EC','#F64D2A','#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
      // '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
      colors:['#084638','#084638'],
      chart: {
          type: charttype,
          options3d: {enabled: threeD, alpha: 45},
          events:{ },
          // height:280
      },
      title: {text: title},
      // xAxis:{categories:  categories},
      // subtitle: {text: subtitle },
      tooltip: {pointFormat: ''},
      plotOptions: {
        pie: {
          innerSize: 150,
          depth: 45,
          allowPointSelect: true,
          cursor: 'pointer',
          states: {
            inactive: {
              opacity: 1
            },
          },
          showInLegend: true,
          legend: {
            enabled: true
          },
          point:{
            events:{
              // mouseOver: (obj:any) => {
              //   obj.target.graphic.attr({
              //       'stroke-width': 1.2,
              //       stroke: obj.target.color,
              //       zIndex: 3,
              //       margin : 10,
              //       opacity: 1
              //       // filter: 'drop-shadow(0 0 10px black)'
              //     }).css({borderRadius: 20}).add();
              // },
              // mouseOut: (obj:any) => {
              //   obj.target.graphic.attr({
              //       'stroke-width': 1,
              //       stroke: obj.target.color,
              //       margin: 0,
              //       filter: 'transparent',
              //   }).css({borderRadius: 0}).add();
              // },
            }
          }
        }
      },
      series: [{
          name: antype,
          data: data,
          marker: { fillColor: '#084638', radius: 3 , lineWidth: 2, lineColor: null},
          state:{
            hover:{
              halo: null,
              brightness: 0,
            }
          },
          point:{events:{ }}
      }]
    };
    return Highcharts.chart(elementid, this.options);
  }

  createchart1(charttype:any,threeD:any, title:any, data:any, elementid:any, antype:any){
    if(antype==null) {
      antype = ""
    }
    this.options = {
      colors:['#084638','#084638'],
      chart: {
          type: charttype,
          options3d: {enabled: threeD,alpha: 45},
          events:{ },
      },
      title: {text: title},
      // subtitle: {text: subtitle },
      // xAxis:{categories:  categories},
      tooltip: {pointFormat: ''},
      plotOptions: {
        pie: {
          innerSize: 150,
          depth: 45,
          allowPointSelect: true,
          cursor: 'pointer',
          states: {
            inactive: {opacity: 1},
          },
          showInLegend: true,
          legend: {
            enabled: true
          },
          point:{
            events:{ }
          }
        }
      },
      series: [{
          name: antype,
          data: data,
          marker: { fillColor: '#BF0B23', radius: 3 , lineWidth: 2, lineColor:null},
          state:{
            hover:{
              halo: null,
              brightness: 0,
            }
          },
          point:{events:{ }}
      }]
    };
    return Highcharts.chart(elementid, this.options);
  }


//new graph
  create(charttype: any, threeD: any, title: any, data: any, elementid: any, antype: any) {
    this.options = {
      colors:['#98c27a','#98c27a'],
      chart: {
          type: 'column'
      },
      title: {
          text: 'Sales Graph'
      },
      xAxis: {

          categories: ['Production Cost', 'Sales', 'Profit/Loss',]
      },
      credits: {
          enabled: false
      },
      plotOptions: {
          column: {
              borderRadius: '1%'
          }
      },
      series: [
        {
          name: 'Amount',
          data: data
      }
    ]
  };

  return Highcharts.chart(elementid, this.options);
  }

  create1(charttype: any, threeD: any, title: any, data: any, elementid: any, antype: any) {
    this.options = {
      colors:['#98c27a','#98c27a'],
      chart: {
          type: 'column'
      },
      title: {
          text: 'Production Graph'
      },
      xAxis: {
        categories: ['Total Sarees', 'Sarees Sold', 'Remaining Sarees',]
      },
      credits: {
          enabled: false
      },
      plotOptions: {
          column: {
              borderRadius: '1%'
          }
      },
      series: [
        {
          name: 'Sarees',
          data: data
      }
    ]
  };

  return Highcharts.chart(elementid, this.options);
  }

  
  



  //api
  baseUrl = `${environment.baseUrl}/weavers`;

  // baseUrl = 'http://192.168.0.237:8080';
  
  // productionGraph() {
  //   let url = `${this.baseUrl}/productionGraph_1_0`;
  //   return this.http.get(url);
  // }


  // salesGraph() {
  //   let url = `${this.baseUrl}/salesGraph_1_0`;
  //   return this.http.get(url);
  // }

  salesGraph(payload?:any) {
    let url = this.baseUrl + '/salesGraph_1_0';
    let params = new HttpParams()
    if(payload?.startDate) {
      params = params.set('startDate', formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us'))
    } else {        
      let date = new Date()
      date.setMonth(new Date().getMonth() -1)
      params = params.set('startDate', formatDate(date ,'yyyy-MM-dd', 'en-us'))
    }

    if(payload?.endDate) {
      params = params.set('endDate', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us') )
    } else {
      params = params.set('endDate',formatDate(new Date() , 'yyyy-MM-dd', 'en-us'))
    }
    return this.http.get(url,{params:params});
  }
  
  productionGraph(payload?:any) {
    let url = this.baseUrl + '/productionGraph_1_0';
    let params = new HttpParams()
    if(payload?.startDate) {
      params = params.set('startDate', formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us'))
    } else {    
      
      let date = new Date()
      date.setMonth(new Date().getMonth() -1)
      params = params.set('startDate', formatDate(date ,'yyyy-MM-dd', 'en-us'))
    }
    if(payload?.endDate) {
      params = params.set('endDate', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us') )
    } else {
      params = params.set('endDate', formatDate(new Date() , 'yyyy-MM-dd', 'en-us'))
    }
    return this.http.get(url,{params:params});
  }

  
}


/** use function to create chart with <div id="container"></div>
  mychart(){
    var charttype = 'pie';
    var threeD = true;
    var title = 'Employee Efficiency - Bay 1';
    var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    var antype = 'Minutes';
    var elementid = 'container';
    var data =  [
      ['91 Minutes', 91],
      ['66 Minutes', 66]
    ];
    this.dataservice.createchart(charttype, threeD, title, subtitle, antype, data, elementid)
  }


  types: line, spline, area, areaspline, column, bar, pie, scatter, gauge, arearange, areasplinerange and columnrange
 */
