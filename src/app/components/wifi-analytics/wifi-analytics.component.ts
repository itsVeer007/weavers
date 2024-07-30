import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';


@Component({
  selector: 'app-wifi-analytics',
  templateUrl: './wifi-analytics.component.html',
  styleUrls: ['./wifi-analytics.component.css']
})
export class WifiAnalyticsComponent implements OnInit {


  showLoader = false;
  constructor(
    private inventorySer:InventoryService,
    private siteSer:SiteService,
    private assetSer: AssetService,
    private metaDatSer: MetadataService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    public alertSer: AlertService,
    private storageSer: StorageService
  ) { }


first:boolean = true;
second:boolean = false;
open(type:string) {
  // this.count();
  if(type == 'data') {
    this.second = true;
    this.first =false;
  }
  else
  this.first = true;
}

  tempSites:any;
  siteData: any;
  user: any;
  ngOnInit(): void {
    this.user =   JSON.parse(localStorage.getItem('user')!);
    this.tempSites = JSON.parse(localStorage.getItem('temp_sites')!);
    this.get_data();
    // this.listSites();
  }


// Wifi Analytics
total:any;
active:any;
inActive:any;
newWifiData:any = [];
WifiData:any;
get_data() {
    this.assetSer.totaldevices().subscribe((res:any)=> {
      // console.log(res);
      this.getMetadata();
      this.WifiData = res;
      this.newWifiData = this.WifiData;
      // this.total = this.newWifiData.reduce((sum:any, current:any) => sum + current.total, 0);
      // this.active = this.newWifiData.reduce((sum:any, current:any) => sum + current.active, 0);
      // this.inActive = this.newWifiData.reduce((sum:any, current:any) => sum + current.inActive, 0);
    })
  }

  @ViewChild('viewDetailsDialog') viewDetailsDialog = {} as TemplateRef<any>;
  GetDevicesTodayData:any;
  GetDevicesToday(data:any) {

    // this.assetSer.GetDevicesToday(data).subscribe((res:any)=> {
    //   this.dialog.open(this.viewDetailsDialog);
    //   this.GetDevicesTodayData = res.data;
    // })
  }


  // GetActiveDevicesData:any;
  // GetActiveDevices() {
  //   this.assetSer.GetActiveDevices().subscribe((res:any)=> {
  //     // console.log(res);
  //     this.GetActiveDevicesData = res;
  //   })
  // }

  // GetInactiveDevicesTodayData:any;
  // GetInactiveDevicesToday() {
  //   this.assetSer.GetInactiveDevicesToday().subscribe((res:any)=> {
  //     // console.log(res);
  //     this.GetInactiveDevicesTodayData = res;
  //   })
  // }















  frFilterBody: any = {
    p_frId: null,
    p_startdate:null,
    p_enddate:null
  }

  listSitesData: any
  reportsData:any = [];
  listFRReports() {
    this.frFilterBody.p_frId = this.user?.UserId;
    this.inventorySer.listFRReports(this.frFilterBody).subscribe((res: any)=> {
      // console.log(res);
      this.reportsData = res;
    })
  }

  searchText: any;

  ticketOpen: any = [];
  ticketClose: any = [];
  ticketProgress: any = [];
  ticketRejected: any = [];


  priorityVal: any;
  statusVal: any;
  assignedTo: any;
  ticketType: any;
  sourceOfRequest: any
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    for(let item of data) {
      if(item.type == 'Ticket_Status') {
        this.statusVal = item.metadata;
      } else if(item.type == "Ticket_Priority") {
        this.priorityVal = item.metadata;
      } else if(item.type == "Assigned_To") {
        this.assignedTo = item.metadata;
      } else if(item.type == "Ticket_Type") {
        this.ticketType = item.metadata;
      } else if(item.type == "Source_of_Request") {
        this.sourceOfRequest = item.metadata;
      }
    }
  }

  sId: any = '';
  tId: any = '';
  tStatus: any = '';
  stDt: any;
  enDt: any;

  applyFilter() {
    let myObj = {
      'siteId': this.sId ? this.sId : -1,
      'typeId': this.tId ? this.tId : -1,
      'ticketStatus': this.tStatus ? this.tStatus : '',
      'startDate': this.stDt ? this.datePipe.transform(this.stDt,'yyyy-MM-dd HH:mm:ss') : '',
      'endDate': this.enDt ? this.datePipe.transform(this.enDt,'yyyy-MM-dd HH:mm:ss') : ''
    }

    this.inventorySer.filterTicket(myObj).subscribe((res: any) => {
      // console.log(res);
      // this.newTicketData = res;
    })
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    if (x.style.display == 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  showAddSite = false;
  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;
  showSite = false;

  closenow(value: any, type: String) {
    if (type == 'ticket') { this.showTicket = value; }
  }

  showTicket: boolean = false;

  show(type: string) {
    if (type == 'ticket') { this.showTicket = true }
  }


  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  @ViewChild('viewTicketDialog') viewTicketDialog = {} as TemplateRef<any>;
  ticketTasks: any;
  ticketVisits: any;
  ticketComments: any = [];
  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewTicketDialog);
    // console.log(this.currentItem);
    this.inventorySer.getTasks(item.ticketId).subscribe((tasks: any) => {
      // console.log(res);
      this.ticketTasks = tasks;
    });

    this.inventorySer.getTicketVisits(item.ticketId).subscribe((visits: any) => {
      // console.log(res);
      this.ticketVisits = visits;
    });

    this.inventorySer.getcomments(item.ticketId).subscribe((comments: any) => {
      this.ticketComments = comments;
    });

    // this.inventorySer.comment$.subscribe((cmt: any) => {
    //   console.log(cmt);
    //   this.ticketComments = cmt;
    // })
  }


  assignedObj = {
    assignedTo: ""
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  toAssign: any;
  openAssigned(item: any) {
    // console.log(item)
    this.toAssign = item;
    this.dialog.open(this.assignedDialog);
  }

  toAssigned() {
    let myObj = {
      'ticketId': this.toAssign.ticketId,
      'assignedTo': this.assignedObj.assignedTo,
      "assignedBy": 1
    }

    this.inventorySer.assignTicket(myObj).subscribe((res: any) => {
      // console.log(res);
        this.alertSer.success(res?.message);
    }, (err: any) => {
        if(err) {
          this.alertSer.error(err?.error?.message);
        }
    })
  }


  cmtValue: any;
  newComment: any = [];
  todayDate = new Date();
  createComment() {
    this.newComment.push(this.cmtValue);
    let myObj = {
      'ticketId': this.currentItem.ticketId,
      'message': this.cmtValue,
      'createdBy': this.user?.UserId
    }

    this.inventorySer.createComment(myObj).subscribe((res: any) => {
    this.inventorySer.comment$.next(res);
    });
    this.cmtValue = ''
  }

  @ViewChild('table', { static: false }) table!: ElementRef;
  generatePDF() {
    const doc = new jsPDF();
    const table = this.table.nativeElement;
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('table-data.pdf');
    });
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.reportsData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


}
