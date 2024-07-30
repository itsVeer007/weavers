import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';

@Component({
  selector: 'app-qr-ads',
  templateUrl: './qr-ads.component.html',
  styleUrls: ['./qr-ads.component.css']
})
export class QRAdsComponent implements OnInit {
  filterbody: any;

  showLoader = false;
  constructor(
    private assetSer: AssetService,
    private alertSer: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getInventory();
  }



  searchText: any;
  searchTx: any;
  qrData: any[] = [];
  newQrData: any[] = [];


  installed: any = [];
  inStock: any = [];
  scrap: any = [];
  redyToUse: any = [];

  numberOfScans: number = 0;
  numberOfAds: number = 0;

  getInventory() {
    this.assetSer.list().subscribe((res: any) => {
      // console.log(res);

      this.qrData = res;
      // console.log(this.qrData);
      this.newQrData = this.qrData;

      this.numberOfScans = this.qrData.reduce((total, entry) => total + entry.no_of_scans, 0);
      this.numberOfAds = this.qrData.reduce((total, entry) => total + entry.no_of_ads, 0);

    });

    // this.http.get('assets/JSON/addReport.json').subscribe((res: any) => {
    //   // console.log(res);
    //   this.qrData = res;
    //   this.newQrData = this.qrData;
    // })
  }

  filterBody = {
    siteId: null,
    deviceId: null,
    fromDate: null,
    toDate: null
  }

  filterQrAds() {
    this.assetSer.filterReports(this.filterBody).subscribe((res:any)=>{
      // console.log(res);
      // this.newQrData = res;
      this.newQrData = res;
    })
  }

  filterTableData: any;
  filteredQrData: any;
  get fun() {
    this.filterTableData = this.newQrData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.deviceId == current.deviceId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return this.filterTableData;
  }

  get fun1() {
    this.filteredQrData = this.qrData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.url == current.url);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return this.filteredQrData;
  }


  siteIds: any;
  deviceIds: any;
  removeDuplicates() {
    this.siteIds = this.qrData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.siteId == current.siteId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.deviceIds = this.qrData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.deviceId == current.deviceId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  productCategoryId: any = null;
  productTypeId: any = null;
  productStatusId: any = null;

  applyFilter() {
    let myObj = {
      'productCategoryId': this.productCategoryId ? this.productCategoryId : '',
      'productTypeId': this.productTypeId ? this.productTypeId : '',
      'productStatusId': this.productStatusId ? this.productStatusId : '',
    }

    this.assetSer.filteBody(myObj).subscribe((res: any) => {
      // console.log(res);
      this.newQrData = res;
    })
  }

  closenow(value: any, type: String) {
    if (type == 'inventory') { this.showInventory = value; }
  }

  showInventory: boolean = false;

  show(type: string) {
    if (type == 'inventory') { this.showInventory = true; }
  }

  masterSelected: boolean = false;

  // allchecked(e:any){
  //   if(document.querySelector('#allchecked:checked')){
  //     this.masterSelected = true;
  //   }else {
  //     this.masterSelected = false;
  //   }
  // }


  selectedAll: any;

  selectAll() {
    for (var i = 0; i < this.qrData.length; i++) {
      this.qrData[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.qrData.every(function (item: any) {
      return item.selected == true;
    })
  }

  currentItem: any;
  originalObject: any;

  /* view inventory */

  @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;

  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewInventoryDialog);
    // console.log(this.currentItem);
  }

  /* update inventory */

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;

  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editInventoryDialog);
    // console.log(item);
  }

  updateInventory0: any;
  updateInventory1: any;
  updateInventory2: any;
  editInventory() {
    // console.log(this.currentItem);
    // this.qrData= this.qrData.filter((item:any) => item.siteId !== this.currentItem.siteId);
    // this.getInventory();

    this.originalObject = {
      "id": this.currentItem.id,
      "productCategoryId": this.currentItem.productCategoryId,
      "name": this.currentItem.name,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "productModelId": this.currentItem.productModelId,
      "productTypeId": this.currentItem.productTypeId,
      "cost": this.currentItem.cost,
      "purchaseVendorId": this.currentItem.purchaseVendorId,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "productStatusId": this.currentItem.productStatusId,
      "remarks": this.currentItem.remarks
    }


    this.assetSer.updateProductMaster(this.originalObject).subscribe((res: any) => {
      // console.log(res);
      this.getInventory();
      this.alertSer.success(res?.message);
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message)
      };
    });
  }


  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog);
    // console.log("Selected Item:: ", item);
  }

  deleteInventory0: any;
  deleteInventory1: any;
  deleteInventory2: any;
  deleteInventory() {
    this.alertSer.wait();

    this.assetSer.deleteProduct(this.currentItem).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.qrData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  //Show Detail
  showDetail: boolean = false;

  onShowDetail() {
    this.showDetail = !this.showDetail
  }

}
