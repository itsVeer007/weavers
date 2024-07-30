import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { MetadataService } from 'src/services/metadata.service';
import { formatDate } from '@angular/common';
import { StorageService } from 'src/services/storage.service';
import { InventoryService } from 'src/services/inventory.service';

@Component({
  selector: 'app-add-new-asset',
  templateUrl: './add-new-asset.component.html',
  styleUrls: ['./add-new-asset.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewAssetComponent implements OnInit {

  @Input() cartData:any;


  @Output() newItemEvent = new EventEmitter<any>();

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    private siteService: SiteService,
    private storageSer: StorageService,
    private inventorySer:InventoryService
  ) { }

    addAssetForm: any = UntypedFormGroup;
    searchText: any;
    currentDate = new Date();

  personshow : boolean = false;
  toggleShowOnOff() {
    this.personshow = !this.personshow;
  }

  enableDemo: boolean = false;
  user: any;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.addAssetForm = this.fb.group({
      'file': new UntypedFormControl('', Validators.required),
      'deviceModeId': new UntypedFormControl(''),
      'name': new UntypedFormControl('', Validators.required),
      'playOrder': new UntypedFormControl(''),
      'createdBy': new UntypedFormControl(''),
      'splRuleId': new UntypedFormControl(''),
      'fromDate': new UntypedFormControl(''),
      'toDate': new UntypedFormControl(''),

      'adFor': new UntypedFormControl(''),
      'enableDemo': new UntypedFormControl(''),

      'timeId': new UntypedFormControl(''),
      'tempId': new UntypedFormControl(''),
      'maleKids': new UntypedFormControl(''),
      'femaleKids': new UntypedFormControl(''),
      'maleYouth': new UntypedFormControl(''),
      'femaleYouth': new UntypedFormControl(''),
      'maleAdults': new UntypedFormControl(''),
      'femaleAdults': new UntypedFormControl(''),
      'vehicles': new UntypedFormControl(''),
      'persons': new UntypedFormControl(''),

      'object': new UntypedFormControl(''),
      'person_vehicle': new UntypedFormControl('')
    });

    this.addAssetForm.get('deviceModeId').valueChanges.subscribe((val: any) => {
      if(val == 2 || val == 3) {
        this.addAssetForm.get('timeId').setValidators(Validators.required);
        this.addAssetForm.get('tempId').setValidators(Validators.required);
      } else {
        this.addAssetForm.get('timeId').clearValidators();
        this.addAssetForm.get('tempId').clearValidators();
      }
      this.addAssetForm.get('timeId').updateValueAndValidity();
      this.addAssetForm.get('tempId').updateValueAndValidity();
    });

    this.onMetadataChange()
    this.listCart();
  };


  localCartData:any = [];
  listCart() {
    this.inventorySer.listCart().subscribe((res)=> {
      // console.log(res)
      this.localCartData = res;
      this.localCartData.forEach((item: any) => {
        item.clothType = item.itemName;
        item.quantity = 0;
      })
      this.groupItemsByType();
    })
  }

  groupedItems: any = [];
  groupItemsByType() {
    const groupedMap = new Map<number, { quantity: number, totalPrice: number, image: any, itemName: any }>();
    this.localCartData.forEach((item: any) => {
      const type = item.price;
      if (!groupedMap.has(type)) {
        groupedMap.set(type, { quantity: 0, totalPrice: item.price, image: item.image, itemName: item.itemName });
      }
      const currentItem: any = groupedMap.get(type);
      currentItem.quantity += 1;
      currentItem.totalPrice = item.price * currentItem.quantity;
    });

    this.groupedItems = Array.from(groupedMap.entries()).map(([price, data]) => ({
      price: price,
      itemName: data.itemName,
      quantity: data.quantity,
      totalPrice: data.totalPrice,
      image: data.image
    }));

    // console.log(this.groupedItems)
  }

  data: any;
  siteIdList: any;
  deviceIdList: any;
  getRes() {
    this.siteService.listSites().subscribe((res: any) => {
      // console.log(res);
      this.siteIdList = res.sitesList;
    })

    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      const assets = res.flatMap((item: any) => item.adsDevices);
      // console.log(assets);
      this.deviceIdList = assets;
    })
  }


  closeForm() {
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
  adsTime: any;
  onMetadataChange() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
      for(let item of data) {
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
        else if(item.type == 'Ads_Time') {
          this.adsTime = item.metadata;
        }
      }
  }

  count:number = 0;
  increment() {
    this.count++;
  }

  decrement() {
    if(this.count > 0) {
      this.count--;
    }
  }

  buyNow() {
    // this.inventorySer.createClientRequest(this.localCartData).subscribe((res:any)=> {
    // })
  }

}
