import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-device',
  templateUrl: './add-new-device.component.html',
  styleUrls: ['./add-new-device.component.css'],
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
export class AddNewDeviceComponent implements OnInit {

  @Input() fromSites: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`additionalSite`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddAdditionalSite(false);
  //     }
  //   }
  // }

  addDevice: any =  UntypedFormGroup;
  searchText: any;

  constructor(
    private fb: UntypedFormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService
  ) { }

  siteData: any;

  adInfo = {
    siteId: null,
    deviceDescription: '',
    deviceTypeId: null,
    deviceCallFreq: 1,
    deviceModeId: null,
    adsHours: '0-23',
    workingDays: '',
    createdBy: null,
    softwareVersion: '',
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

  user: any;
  ngOnInit() {
    this.siteData = JSON.parse(localStorage.getItem('siteIds')!);
    this.user =   JSON.parse(localStorage.getItem('user')!);

    this.addDevice = this.fb.group({
      'siteId': new UntypedFormControl('', Validators.required),
      'deviceDescription': new UntypedFormControl('', Validators.required),
      'deviceTypeId': new UntypedFormControl('', Validators.required),
      'deviceCallFreq': new UntypedFormControl('', Validators.required),
      'deviceModeId': new UntypedFormControl('', Validators.required),
      'adsHours': new UntypedFormControl('', Validators.required),
      'workingDays': new UntypedFormControl('', Validators.required),
      'createdBy': new UntypedFormControl(''),
      'softwareVersion': new UntypedFormControl(''),
      'socketServer': new UntypedFormControl(''),
      'socketPort': new UntypedFormControl(''),

      'weatherInterval': new UntypedFormControl(''),

      'cameraId': new UntypedFormControl(''),
      'modelName': new UntypedFormControl(''),
      'modelWidth': new UntypedFormControl(''),
      'modelHeight': new UntypedFormControl(''),
      'modelMaxResults': new UntypedFormControl(''),
      'modelThreshold': new UntypedFormControl(''),
      'modelObjectTypeId': new UntypedFormControl(''),

      "loggerFreq": new UntypedFormControl(''),
      "refreshRules": new UntypedFormControl(''),
      "debugOn": new UntypedFormControl(''),
      "debugLogs": new UntypedFormControl(''),
      'remarks': new UntypedFormControl(''),
    });

    this.addDevice.get('deviceModeId').valueChanges.subscribe((val: any) => {
      if(val == 3) {
        // this.addDevice.get('cameraId').setValidators(Validators.required);
        // this.addDevice.get('modelName').setValidators(Validators.required);
        // this.addDevice.get('modelWidth').setValidators(Validators.required);
        // this.addDevice.get('modelHeight').setValidators(Validators.required);
        // this.addDevice.get('modelMaxResults').setValidators(Validators.required);
        // this.addDevice.get('modelThreshold').setValidators(Validators.required);
        this.addDevice.get('modelObjectTypeId').setValidators(Validators.required);
      } else {
        // this.addDevice.get('cameraId').clearValidators();
        // this.addDevice.get('modelName').clearValidators();
        // this.addDevice.get('modelWidth').clearValidators();
        // this.addDevice.get('modelHeight').clearValidators();
        // this.addDevice.get('modelMaxResults').clearValidators();
        // this.addDevice.get('modelThreshold').clearValidators();
        this.addDevice.get('modelObjectTypeId').clearValidators();
      }

      // this.addDevice.get('cameraId').updateValueAndValidity();
      // this.addDevice.get('modelName').updateValueAndValidity();
      // this.addDevice.get('modelWidth').updateValueAndValidity();
      // this.addDevice.get('modelHeight').updateValueAndValidity();
      // this.addDevice.get('modelMaxResults').updateValueAndValidity();
      // this.addDevice.get('modelThreshold').updateValueAndValidity();
      this.addDevice.get('modelObjectTypeId').updateValueAndValidity();
    });

    this.getDeviceDetail();
  }

  deviceData: any = [];
  deviceLength: any;
  // deviceMap: any;
  getDeviceDetail() {
    this.getMetadata();
    // this.devService.listDeviceAdsInfo().subscribe((res: any) => {
    //   for(let item of res) {
    //     if(this.siteData.siteid == item.siteId) {
    //       this.deviceData = item.adsDevices;
    //       this.deviceLength = this.deviceData.length;
    //     }
    //   }
    // })

    // this.deviceData = this.fromSites;
    // this.deviceLength = this.deviceData.length;
    // console.log(this.deviceData);
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
    this.dialog.open(this.editDevice);
    this.currentItem = item;

    let x = this.currentItem.workingDays.toString().split(',')
    this.currentItem.workingDays = x;

    // this.newdeviceId = item.deviceId;
    // console.log(this.currentItem);
  }


  /* dynamic device view */

  // toChild: any
  // onMat(e: any) {
  //   this.toChild = this.deviceData.filter((el: any) => el.deviceId == e.tab.textLabel);
  //   console.log(this.toChild)
  // }


  /* create device */

  toAddDevice: any;
  onToAddDevice(e: any) {
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
  }

  addDeviceDtl() {
    // console.log(this.addDevice);
    if(this.addDevice.valid) {
      this.newItemEvent.emit();
      let arr = JSON.parse(JSON.stringify(this.adInfo.workingDays)).join(',');
      if(this.toAddDevice == 8) {
        var myString = arr.substring(1);
        this.adInfo.workingDays = myString;
      } else {
        this.adInfo.workingDays = arr;
      }
      this.alertSer.wait();
      this.adInfo.createdBy = this.user?.UserId;
      this.assetSer.createDeviceandAdsInfo(this.adInfo).subscribe((res: any) => {
        // console.log(res);
        this.alertSer.success(res?.message ? res?.message : 'Device created successfully');
      },
      (err: any) => {
        this.alertSer.error(err?.error?.message);
      })
    }
  }


  // showAdsHours: boolean = false;
  // showAdsHoursTxt: any = '...more'
  // showAd() {
  //   this.showAdsHours = !this.showAdsHours;

  //   if(this.showAdsHours == false) {
  //     this.showAdsHoursTxt = '...more';
  //   } else {
  //     this.showAdsHoursTxt = '...less'
  //   }
  // }


  @ViewChild('mySel') mySel!: MatSelect;

  @ViewChild('mySell') mySell!: MatSelect;

  allSelected = false;
  toggleAllSelection() {
    this.allSelected = !this.allSelected;

    if(this.allSelected) {
      this.mySel?.options?.forEach( (item : MatOption) => item.select());
    } else {
      this.mySel?.options?.forEach( (item : MatOption) => {item.deselect()});
    }

    if(this.allSelected) {
      this.mySell?.options?.forEach( (item : MatOption) => item.select());
    } else {
      this.mySell?.options?.forEach( (item : MatOption) => {item.deselect()});
    }
  }
}
