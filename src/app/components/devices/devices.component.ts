import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<boolean>();

  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private assetSer: AssetService,
    private siteSer: SiteService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService
  ) { }

  ngOnInit(): void {
    this.listSales();
    this.getStatus();
  }

  siteData: any = [];
  listSales() {
    this.inventorySer.listInvoices().subscribe((res: any) => {
      // console.log(res);
      this.siteData = res;
    });
  }

  searchText: any;
  deviceData: any = [];
  newDeviceData: any = [];
  active: any = [];
  inActive: any = [];
  // listDeviceBySiteId(siteId: any) {
  //   this.showLoader = true;
  //   this.assetSer.listDeviceBySiteId(siteId).subscribe((res: any) => {
  //     // console.log(res);
  //     this.showLoader = false;
  //     this.filterObj.siteId = this.siteData[0]?.siteid;
  //     this.deviceData = res.flatMap((item: any) => item.adsDevices);
  //     this.newDeviceData = this.deviceData;
  //     this.active = [];
  //     this.inActive = []
  //     for(let item of this.newDeviceData) {
  //       if(item.status == 1) {
  //         this.active.push(item);
  //       } else if(item.status == 2) {
  //         this.inActive.push(item);
  //       }
  //     }
  //   })
  // }

  upTime: any;
  getStatus() {
    this.assetSer.getHealth().subscribe((res: any) => {
      this.upTime = res.flatMap((item: any) => item.on);
      // console.log(this.upTime[0]?.firstConnected.this.da - this.upTime[0]?.lastConnected)
    })
  }

  /* searches */
  siteSearch: any;
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  filterObj = {
    siteId: null,
    deviceId: null,
  }

  filterDevices() {
    this.showLoader = true;
    this.assetSer.listDeviceAdsInfo1(this.filterObj).subscribe((res: any) => {
      this.showLoader = false;
      this.newDeviceData = res.flatMap((item: any) => item.adsDevices);

      this.active = [];
      this.inActive = [];
      for(let item of this.newDeviceData) {
        if(item.status == 1) {
          this.active.push(item);
        } else if(item.status == 2) {
          this.inActive.push(item);
        }
      }
    })
  }

  makeNull() {
    this.filterObj.deviceId = null;
  }

  statusNg: any = 'All';
  filterStatus(value: any) {
    if(value != 'All') {
      this.newDeviceData = this.deviceData.filter((el: any) => el.status == value);
    } else {
      this.newDeviceData = this.deviceData;
    }
    this.active = [];
    this.inActive = []
    for(let item of this.newDeviceData) {
      if(item.status == 1) {
        this.active.push(item);
      } else if(item.status == 2) {
        this.inActive.push(item);
      }
    }
  }

  /* metadata */
  deviceType: any;
  deviceMode: any;
  workingDay: any;
  tempRange: any;
  ageRange: any;
  modelObjectType: any;
  model: any;
  modelResolution: any;
  softwareVersion: any;
  weatherInterval: any;
  deviceStatus: any
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    for(let item of data) {
      if(item.type == 'Device_Type') {
        this.deviceType = item.metadata;
      } else if(item.type == 'Device_Mode') {
        this.deviceMode = item.metadata;
      } else if(item.type == 'Working_Day') {
        this.workingDay = item.metadata;
      } else if(item.type == 'Ads_Temp_Range') {
        this.tempRange = item.metadata;
      } else if(item.type == 'Ads_Age_Range') {
        this.ageRange = item.metadata;
      } else if(item.type == 'model_object_type') {
        this.modelObjectType = item.metadata;
      } else if(item.type == 'Model') {
        this.model = item.metadata;
      } else if(item.type == 'Model Resolution') {
        this.modelResolution = item.metadata;
      } else if(item.type == 'Ads_Software_Version') {
        this.softwareVersion = item.metadata;
      } else if(item.type == 'Weather_Interval') {
        this.weatherInterval = item.metadata;
      } else if(item.type == 'Device_Status') {
        this.deviceStatus = item.metadata;
      }
    }
  }

  @ViewChild('rebootDeviceDialog') rebootDeviceDialog = {} as TemplateRef<any>;
  openRebootDevice(item: any) {
    this.currentItem = item;
    this.dialog.open(this.rebootDeviceDialog);
  }

  rebootDevice(id: any) {
    this.alertSer.wait();
    this.assetSer.updateRebootDevice(id).subscribe((res: any) => {
      // console.log(res)
      if(res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("THREE DOTS:: ",e.target.parentNode.nextElementSibling);
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
  // closenow(value:any) {
  //   this.showAddSite = value;
  // }

  showAddDevice: boolean = false;
  showDeviceInfo: boolean = false;
  show(type: any) {
    if(type == 'device') { this.showAddDevice = true }
    // if(type == 'device-info') { this.showDeviceInfo = true }
  }

  closenow(type: any) {
    if(type == 'device') {this.showAddDevice = false}
    // if(type == 'device-info') {this.showDeviceInfo = false}
  }

  masterSelected: boolean = false;

  // allchecked(e:any){
  //   if(document.querySelector('#allchecked:checked')){
  //     this.masterSelected = true;
  //   }else {
  //     this.masterSelected = false;
  //   }
  // }


  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;
  y: any
  openEditStatus(id: any) {
    // console.log(id);
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  staObj = {
    status: ""
  }


  changeAssetStatus() {
    let statusObj = {
      ticketId: this.y.ticketId,
      status: this.staObj.status
    }

    this.inventorySer.updateTask(statusObj).subscribe((res: any) => {
      // console.log(res);
    })
  }



  currentItem: any;
  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  openViewPopup(item: any) {
    this.currentItem = item;
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.viewSiteDialog);
    // console.log(item);
    // console.log(this.currentWorkingDays);
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;

  originalObject: any;
  changedKeys: any[] = [];

  onRadioChange(event: any) {
    // console.log(event);
    this.originalObject = {
      "deviceId": this.currentItem.deviceId,

      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,

      "deviceModeId": this.currentItem.deviceModeId,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,

      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,

      "modifiedBy": 1,
    };

    let x = event.source.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(event: any) {
    this.originalObject = {
      "deviceId": this.currentItem.deviceId,

      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,

      "deviceModeId": this.currentItem.deviceModeId,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,

      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,

      "modifiedBy": 1,
    };

    let x = event.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    this.originalObject = {
      "deviceId": this.currentItem.deviceId,

      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,

      "deviceModeId": this.currentItem.deviceModeId,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,

      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,

      "modifiedBy": 1,
    };

    let x = event.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
    // console.log(this.changedKeys.length)
  }

  currentWorkingDays: any;
  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.editSiteDialog);
    // console.log(item);
  }

  toAddDevice: any;
  onToAddDevice(e: any) {
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
  }

  updateDeviceDtl() {
    if(this.changedKeys.length > 0) {
      // this.alertSer.wait();
      let arr = this.currentWorkingDays.join(',');
      if(this.toAddDevice == 8) {
        var myString = arr.substring(1);
        this.originalObject.workingDays = myString;
      } else {
        this.originalObject.workingDays = arr;
      }
    }
    this.newItemEvent.emit();
    this.assetSer.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success(res?.message ? res?.message : 'Device updated successfully');
    }, (err: any) => {
      this.alertSer.error(err?.error?.message);
    })
  }

  @ViewChild('createWorkingDays') createWorkingDays!: MatSelect;

  selectCreate: boolean = false;
  toggleCreateWorkingDays() {
    this.selectCreate = !this.selectCreate;

    if(this.selectCreate) {
      this.createWorkingDays?.options.forEach((item : MatOption) => item.select());
    } else {
      this.createWorkingDays?.options.forEach((item : MatOption) => item.deselect());
    }
  }


  @ViewChild('modifyWorkingDays') modifyWorkingDays!: MatSelect;

  selectModify: boolean = false;
  toggleModifyWorkingDays() {
    this.selectModify = !this.selectModify;

    if(this.selectModify) {
      this.modifyWorkingDays?.options.forEach((item : MatOption) => item.select());
    } else {
      this.modifyWorkingDays?.options.forEach((item : MatOption) => item.deselect());
    }
  }










  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.deviceData.length; i++) {
      // console.log(this.deviceData[i])
      this.deviceData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.deviceData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }


  deleteRow: any;
  deleteRow1(item: any, i: any) {
    // console.log(item);
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.deviceData.splice(i, 1);
    }, 1000);
  }

  editArray: any = [];
  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }

  editBySelectedOne() {
    if (this.editArray.length > 0) {
    }
    // this.listDeviceBySiteId(this.siteData[0]?.siteid);
  }

  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
    }
  }


  deletearray: any = [];
  deleteMultiRecords(item: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("Delete Multiple Records:: ", item);
    if (this.deletearray.length == 0) { this.deletearray.push(item) }

    this.deletearray.forEach((el: any) => {
      if (el.siteId != item.siteId && checked) {
        this.deletearray.push(item);
        this.deletearray = [...new Set(this.deletearray.map((item: any) => item))]
      }
      if (el.siteId == item.siteId && !checked) {
        var currentindex = this.deletearray.indexOf(item);
        this.deletearray.splice(currentindex, 1)
      }
    });
    // console.log(this.deletearray)
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        // this.currentItem = el;
        // this.confirmDeleteRow();
        this.deviceData = this.deviceData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.deviceData.forEach((el: any) => {
        this.deviceData = this.deviceData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newDeviceData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
