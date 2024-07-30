import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { AdInfoComponent } from './ad-info/ad-info.component';
import { UntypedFormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsComponent implements OnInit {
  // @ViewChild("tabgroup", { static: true }) tabGroup!: MatTabGroup ;
  // @Output() newItemEvent = new EventEmitter();


  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    var y = <HTMLElement>document.getElementById(`icons-site`);

    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    // if (y != null) {
    //   console.log(`icons-site`);
    //   if (!y.contains(e.target)) {
    //     this.icons1 = false;
    //   }
    // }
  }

  constructor(
    private http: HttpClient,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private siteService: SiteService,
    private alertSer: AlertService,
    public cdr:ChangeDetectorRef,

  ) { }

  searchText!: string;
  showLoader: boolean = false;

  pending: any = [];
  added: any = [];
  sycedAfterAddition: any = [];
  sycedAfterRemoval: any = [];
  removed: any = [];

  currentDateTime: any;
  endDateTime: any;

  devDevId: any;
  siteIds: any

  ngOnInit(): void {
    this.devDevId = JSON.parse(localStorage.getItem('add_body')!);
    this.siteIds = JSON.parse(localStorage.getItem('siteIds')!);
    this.currentDateTime = new Date();
    this.endDateTime = new Date('9999-12-31');

    // this.getSiteData();

  }

 

  inputToAddAsset: any;

  assetTable: any = [];
  newAssetTable: any = [];

  siteIdToTable: any;
  newSiteIdToTable: any;

  deviceId: any;
  newDeviceId: any;

  assetMsg: string = '';


  /* search for site id */

  getSiteData() {
    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      // console.log(res);
      let sites = res.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
      this.siteIdToTable = sites.flatMap((item: any) => item.siteId);
      this.newSiteIdToTable = this.siteIdToTable;
      // console.log(this.siteIds);
    })

    this.showLoader = true;
    this.assetSer.listAssets().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.getMetadata();
      // this.assetTable = res;
      this.newAssetTable = res.flatMap((item: any) => item.assets?.sort((a: any, b: any) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0));
      this.cdr.detectChanges();
      this.pending = [];
      this.added = [];
      this.sycedAfterAddition = [];
      this.sycedAfterRemoval = [];
      this.removed = [];
      for(let item of this.newAssetTable) {
        if(item.status == 1) {
          this.pending.push(item);
        }
        if(item.status == 2) {
          this.added.push(item);
        }
        if(item.status == 4) {
          this.sycedAfterAddition.push(item);
        }
        if(item.status == 5) {
          this.sycedAfterRemoval.push(item);
        }
        if(item.status == 3) {
          this.removed.push(item);
        }
        this.cdr.detectChanges();
      }
    })
  }

  filteredOptions!: any[];
  siteIdSearch = new UntypedFormControl();
  siteIdNg: string = 'All';

  filterOptions(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.siteIds.filter((option: any) => option.siteid.toString().toLowerCase().includes(filterValue));
  }

  searchSiteId() {
    this.siteIdSearch.valueChanges.pipe(startWith(''),map((value: any) => this.filterOptions(value))).subscribe((filtered: any) => {
      this.filteredOptions = filtered?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
    });
  }

  myData: any;
  filterSiteId(data: any) {
    if(data == 'All') {
      this.showLoader = true;
      this.assetSer.listAssets().subscribe((res: any) => {
        this.showLoader = false;
        this.newAssetTable = res.flatMap((item: any) => item.assets);

        this.pending = [];
        this.added = [];
        this.sycedAfterAddition = [];
        this.sycedAfterRemoval = [];
        this.removed = [];
        for(let item of this.newAssetTable) {
          if(item.status == 1) {
            this.pending.push(item);
          }
          if(item.status == 2) {
            this.added.push(item);
          }
          if(item.status == 4) {
            this.sycedAfterAddition.push(item);
          }
          if(item.status == 5) {
            this.sycedAfterRemoval.push(item);
          }
          if(item.status == 3) {
            this.removed.push(item);
          }
          this.cdr.detectChanges();
        }
        this.cdr.detectChanges();
      })
    } else {
      this.assetSer.listDeviceBySiteId(data).subscribe((res: any) => {
        this.deviceId = res.flatMap((item: any) => item.adsDevices);
        this.newDeviceId = this.deviceId;
        this.cdr.detectChanges();
      });

      this.assetSer.getAssetBySiteId(data).subscribe((res: any) => {
        this.newAssetTable = res.flatMap((item: any) => item.assets);
        this.myData = this.newAssetTable;

        this.pending = [];
        this.added = [];
        this.sycedAfterAddition = [];
        this.sycedAfterRemoval = [];
        this.removed = [];
        for(let item of this.newAssetTable) {
          if(item.status == 1) {
            this.pending.push(item);
          }
          if(item.status == 2) {
            this.added.push(item);
          }
          if(item.status == 4) {
            this.sycedAfterAddition.push(item);
          }
          if(item.status == 5) {
            this.sycedAfterRemoval.push(item);
          }
          if(item.status == 3) {
            this.removed.push(item);
          }
          this.cdr.detectChanges();
        }
        this.cdr.detectChanges();
      });
    }
  }


  /* search for device id */

  deviceSearch: any;
  deviceIdNg: string = 'All';
  searchDevices(e: any) {
    this.deviceSearch = (e.target as HTMLInputElement).value;
  }

  filterDevices(data: any) {
    this.assetSer.getAssetByDevId(data).subscribe((res: any) => {
      if(data == 'All') {
        this.newAssetTable = this.myData;
        this.cdr.detectChanges();
      } else {
        const assets = res.flatMap((item: any) => item.assets);
        this.assetTable = assets;
        this.newAssetTable = this.assetTable;
        this.cdr.detectChanges();
      }
    })
  }


  /* table filters */

  devMode: any;
  deviceModeNg: string = 'All';
  searchDeviceMode(e: Event) {
    this.devMode = (e.target as HTMLInputElement).value;
  }

  // newFilteredDevices: any;
  filterDeviceMode(data: any) {
    this.newAssetTable = this.assetTable.filter((el: any) => el.deviceModeId == data);
    // this.newFilteredDevices = this.newAssetTable;
    this.cdr.detectChanges();
  }

  statusSearch: any;
  statusNg: string = 'All';
  searchStatus(e: Event) {
    this.statusSearch = (e.target as HTMLInputElement).value;
  }

  filterStatus(data: any) {
    this.newAssetTable = this.assetTable.filter((el: any) => el.status == data);
    this.cdr.detectChanges();
  }


  /* metadata filter */

  deviceMode: any;
  assetStatus: any;
  getMetadata() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Device_Mode') {
          this.deviceMode = item.metadata;
        }
        else if(item.type == 'Asset_Status') {
          this.assetStatus = item.metadata;
        }
      }
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


  showAsset: boolean = false;

  showAddAsset(devData: any) {
    this.showAsset = true;
    localStorage.setItem('add_body', JSON.stringify(devData));
  }

  closenow(value: any, type: String) {
    if (type == 'asset') {
      this.showAsset = value
    }
  }


  currentItem: any;

  /* View Asset */

  @ViewChild('viewAssetDialog') viewAssetDialog = {} as TemplateRef<any>;

  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewAssetDialog);

    // console.log(this.currentItem);
  }



  /* Edit Asset */

  @ViewChild('editAssetDialog') editAssetDialog = {} as TemplateRef<any>;

  openEditPopupp(item: any) {
    this.dialog.open(this.editAssetDialog);

    this.currentItem = JSON.parse(JSON.stringify(item));
    // console.log(item);
  }



  originalObject: any;
  changedKeys: any[] = [];

  onDateChange(e: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "deviceModeId": this.currentItem.deviceModeId,
      "playOrder": this.currentItem.playOrder,
      "modifiedBy": 1,
      "fromDate": this.currentItem.fromDate,
      "toDate": this.currentItem.toDate,
      "active": this.currentItem.active,
      "status": this.currentItem.status
    };

    let x = e.targetElement.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }

    // console.log(this.changedKeys);
  }

  onSelectChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "deviceModeId": this.currentItem.deviceModeId,
      "playOrder": this.currentItem.playOrder,
      "modifiedBy": 1,
      "fromDate": this.currentItem.fromDate,
      "toDate": this.currentItem.toDate,
      "active": this.currentItem.active,
      "status": this.currentItem.status
    };

    let x = event.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }

    // console.log(this.changedKeys);
  }

  onInputChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "deviceModeId": this.currentItem.deviceModeId,
      "playOrder": this.currentItem.playOrder,
      "modifiedBy": 1,
      "fromDate": this.currentItem.fromDate,
      "toDate": this.currentItem.toDate,
      "active": this.currentItem.active,
      "status": this.currentItem.status
    };

    let x = event.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
      // this.originalObject[x] = event.target.value;
    }

    // console.log(this.changedKeys);
  }

  confirmEditRow() {
    this.originalObject.fromDate = this.datepipe.transform(this.currentItem.fromDate, 'yyyy-MM-dd');
    this.originalObject.toDate = this.datepipe.transform(this.currentItem.toDate, 'yyyy-MM-dd');
    this.alertSer.wait();

    this.assetSer.modifyAssetForDevice({asset: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.wait();
      };
    })
  }

  @ViewChild('deleteAssetDialog') deleteAssetDialog = {} as TemplateRef<any>;

  deleteRow: any;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteAssetDialog);
  }

  deleteRow1(item: any, i: any) {
    // console.log(item);
    setTimeout(() => {
      this.assetTable.splice(i, 1);
    }, 1000);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    // this.assetTable = this.assetTable.filter((item: any) => item.siteId !== this.currentItem.siteId);
  }


  /* checkbox control */

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.newAssetTable.length; i++) {
      this.newAssetTable[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.newAssetTable.every(function (item: any) {
      return item.selected == true;
    })
  }


  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewAssetDialog);
    }
  }

  ViewByCheckbox(item: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.viewArray.includes(item) == false) {
      this.viewArray.push(item);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(item) == true) {
      this.viewArray.splice(this.viewArray.indexOf(item), 1)
    }
  }


  editArray: any = [];
  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editAssetDialog);
    }
  }

  EditByCheckbox(itemE: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }


  deletearray: any = [];
  deleteSelected() {
    if (this.selectedAll == false) {
      this.dialog.open(this.deleteAssetDialog);
      this.deletearray.forEach((el: any) => {
        // this.currentItem = el;
        // this.confirmDeleteRow();
        this.assetTable = this.assetTable.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.assetTable.forEach((el: any) => {
        this.assetTable = this.assetTable.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

  deleteMultiRecords(item: any, e: any) {
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


  /* Edit Asset Status */

  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;

  currentStatusId: any
  openEditStatus(id: any) {
    this.dialog.open(this.editStatus);
    this.currentStatusId = id;
  }

  statusObj = {
    status: null,
    modifiedBy: 1
  }

  changeAssetStatus() {
    this.assetSer.updateAssetStatus(this.currentStatusId, this.statusObj).subscribe((res: any) => {
      // console.log(res);
        this.getSiteData();
        this.alertSer.success(res?.message);
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newAssetTable;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  //Ad info popup
  openDialog() {
    this.dialog.open(AdInfoComponent);
  }

  info: boolean = false;
  showDetail() {
    this.info = true;
  }

  hideDetail() {
    this.info = false;
  }

}
