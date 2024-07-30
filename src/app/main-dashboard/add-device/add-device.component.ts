import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { InventoryService } from 'src/services/inventory.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})

export class AddDeviceComponent implements OnInit {
  @Input() fromSites: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  addDevice: any =  UntypedFormGroup;
  searchText: any;

  constructor(
    private fb: UntypedFormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private inventorySer: InventoryService
  ) { }

  siteData: any;
  adInfo: any = {
    siteId: null,
    deviceDescription: '',
    deviceTypeId: null,
    deviceCallFreq: 1,
    deviceModeId: null,
    adsHours: '0-23',
    workingDays: ['',0,1,2,3,4,5,6],
    createdBy: null,
    softwareVersion: 'v1.0.1',
    socketServer: 'ec2-18-213-63-73.compute-1.amazonaws.com',
    socketPort: 6666,
    remarks: '',
    weatherInterval: null, //BSR
    cameraId: 'Cam01', //ODR
    modelName: 'Yolov8', //ODR
    modelWidth: 640, //ODR
    modelHeight: 720, //ODR
    modelMaxResults: 3, //ODR
    modelThreshold: 0.6, //ODR
    modelObjectTypeId: null, //ODR
    refreshRules: 0,  //ODR
    debugOn: 0,  //ODR
    debugLogs: 0, //ODR
    loggerFreq: 60,  //ODR
  }
  // inventoryBody: any = {
  //   recipientName:null,
  //   itemCode: null,
  //   color: null,
  //   colorCode: null,
  //   quality: null,
  //   cost: null,
  //   price:null,
  //   quantity:null,
  // }


  userForm:any = UntypedFormGroup
  user: any;
  ngOnInit() {
    // this.siteData = JSON.parse(localStorage.getItem('temp_sites')!);
    // this.user = JSON.parse(localStorage.getItem('user')!);

    this.userForm = this.fb.group({
      'recipientName':new UntypedFormControl(''),
      'itemCode': new UntypedFormControl(''),
      'color': new UntypedFormControl(''),
      'colorCode': new UntypedFormControl(''),
      'quality': new UntypedFormControl(''),
      'cost': new UntypedFormControl(''),
      'price': new UntypedFormControl(''),
      'quantity':new UntypedFormControl('')
    });
    this.listProduct()
  }

  productMaster: any = [];
  newProductMaster: any = [];
  active: any = [];

  vendorDetail: any;
  listProduct() {
    this.inventorySer.listProduct().subscribe((res: any) => {
      // console.log(res);
      this.productMaster = res;
      this.newProductMaster = this.productMaster;
      for(let item of this.productMaster) {
        if(item.statusId == 1) {
          this.active.push(item);
        }
      }
    });
  }
  // submit() {
  //   if(this.userForm.valid) {
  //     this.alertSer.wait();
  //     console.log(this.userForm)
  //     this.inventorySer.AddSale(this.userForm.value).subscribe((res: any) => {
  //       console.log(res);
  //       this.newItemEvent.emit();
  //       this.alertSer.success(res?.message);
  //     }, (err: any) => {
  //       if(err) {
  //         this.alertSer.error(err?.error?.message);
  //       };
  //     })
  //   }
  // }

  statusItems:any = [];
  openStatusItems(item:any) {
    console.log(item);
    console.log(this.userForm.value);
      this.inventorySer.listInventoryForSending(this.userForm.value).subscribe((res: any) => {
        // console.log(res);
        this.statusItems = res;
      })
    }

  getCurrentDevice(data: any) {
    // console.log('hello')
    this.assetSer.listDeviceByDeviceId(data?.deviceId).subscribe((res: any) => {
      // console.log(res)
    })
  }


  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  closeAddDevice() {
    this.newItemEvent.emit();
  }

  /* metadata methods */
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
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Device_Type') {
          this.deviceType = item.metadata;
        }
        else if(item.type == 'Device_Mode') {
          this.deviceMode = item.metadata;
        }
        else if(item.type == 'Working_Day') {
          this.workingDay = item.metadata;
        }
        else if(item.type == 'Ads_Temp_Range') {
          this.tempRange = item.metadata;
        }
        else if(item.type == 'Ads_Age_Range') {
          this.ageRange = item.metadata;
        }
        else if(item.type == 'model_object_type') {
          this.modelObjectType = item.metadata;
        }
        else if(item.type == 'Model') {
          this.model = item.metadata;
        }
        else if(item.type == 'Model Resolution') {
          this.modelResolution = item.metadata;
        }
        else if(item.type == 'Ads_Software_Version') {
          this.softwareVersion = item.metadata;
        }
        else if(item.type == 'Weather_Interval') {
          this.weatherInterval = item.metadata;
        }
        else if(item.type == 'Device_Status') {
          this.deviceStatus = item.metadata;
        }
      }
    })
  }


  /* popup */
  @ViewChild('editDeviceDialog') editDevice = {} as TemplateRef<any>;
  // newdeviceId: any;
  // devDataToEdit: any
  currentItem: any;
  openEditDevice(item: any) {
    this.currentItem = item;
    this.dialog.open(this.editDevice);
    this.currentItem.workingDays = this.currentItem.workingDays.toString().split(',');
  }


  /* dynamic device view */
  // toChild: any
  // onMat(e: any) {
  //   this.toChild = this.deviceData.filter((el: any) => el.deviceId == e.tab.textLabel);
  //   console.log(this.toChild)
  // }

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
      "modifiedBy": this.user?.UserId,
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

      "modifiedBy": this.user?.UserId,
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
      "modifiedBy": this.user?.UserId,
    };

    let x = event.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  /* update device */

  updateDeviceDtl() {
    this.adInfo.createdBy = this.user?.UserId;
    if(this.changedKeys.length > 0) {
      // this.alertSer.wait();
      let arr = this.currentItem.workingDays.join(',');
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
      if(res) {
        this.alertSer.success(res?.message ? res?.message : 'Device updated successfully');
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    })
  }


  /* create device */
  toAddDevice: any;
  isToogleClicked: boolean = false;
  onToAddDevice(e: any) {
    this.isToogleClicked = true;
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
  }

  addDeviceDtl() {
    if(this.addDevice.valid) {
      this.newItemEvent.emit();
      this.adInfo.siteId = this.siteData.siteid;
      if(!this.isToogleClicked) {
        let arr: string = this.adInfo.workingDays.join(',');
        let myString = arr.substring(1);
        this.adInfo.workingDays = myString;
      }
      if(this.isToogleClicked) {
        let arr = JSON.parse(JSON.stringify(this.adInfo.workingDays)).join(',');
        if(this.toAddDevice == 8) {
          var myString = arr.substring(1);
          this.adInfo.workingDays = myString;
        } else {
          this.adInfo.workingDays = arr;
        }
      }
      this.alertSer.wait();
      this.adInfo.createdBy = this.user?.UserId;
      this.assetSer.createDeviceandAdsInfo(this.adInfo).subscribe((res: any) => {
        // console.log(res);
        if(res) {
          this.alertSer.success(res?.message ? res?.message : 'Device created successfully');
        }
      }, (err: any) => {
        if(err) {
          this.alertSer.error(err?.error?.message);
        };
      })
    }
    // console.log(this.addDevice);
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

}
