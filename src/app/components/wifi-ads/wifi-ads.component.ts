import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';

@Component({
  selector: 'app-wifi-ads',
  templateUrl: './wifi-ads.component.html',
  styleUrls: ['./wifi-ads.component.css']
})
export class WifiAdsComponent implements OnInit {

  showLoader = false;
  constructor(
    private assetSer: AssetService,
    private alertSer: AlertService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // this.getInventory();
  }


  showInventory:boolean = false;
  showSales:boolean = false;
  open(type:string) {
    if(type == 'inventory') {
      this.showInventory = true;
    }
    if(type == 'sales') {
      this.showSales = true;
    }
  }

  closenow(type:string) {
    if(type == 'sales') {
      this.showSales = false;
    }
    if(type == 'inventory') {
      this.showInventory = false;
    }
  }

  // closenow() {
  //   this.newItemEvent.emit();
  // }


  searchText: any;
  searchTx: any;
  productMaster: any = [];
  newProductMaster: any = [];

  installed: any = [];
  inStock: any = [];
  scrap: any = [];
  redyToUse: any = [];
  getInventory() {
    this.assetSer.wifiList().subscribe((res: any) => {
      // console.log(res);

      this.productMaster = res;
      this.newProductMaster = this.productMaster;

    });

    // this.http.get('assets/JSON/addReport.json').subscribe((res: any) => {
    //   this.productMaster = res;
    //   this.newProductMaster = this.productMaster;
    // })
  }


  brandNames: any;
  categoryTypes: any;
  statusVal: any;
  removeDuplicates() {
    this.brandNames = this.productMaster.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productCategoryId == current.productCategoryId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.categoryTypes = this.productMaster.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productTypeId == current.productTypeId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.statusVal = this.productMaster.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productStatusId == current.productStatusId);
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
      this.newProductMaster = res;
    })
  }

  // closenow(value: any, type: String) {
  //   if (type == 'inventory') { this.showInventory = value; }
  // }

  // showInventory: boolean = false;

  // show(type: string) {
  //   if (type == 'inventory') { this.showInventory = true; }
  // }

  masterSelected: boolean = false;

  // allchecked(e:any){
  //   if(document.querySelector('#allchecked:checked')){
  //     this.masterSelected = true;
  //   }else {
  //     this.masterSelected = false;
  //   }
  // }


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

  editInventory() {
    // console.log(this.currentItem);
    // this.productMaster= this.productMaster.filter((item:any) => item.siteId !== this.currentItem.siteId);
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

    this.alertSer.wait();
    this.assetSer.updateProductMaster(this.originalObject).subscribe((res: any) => {
      this.alertSer.success('Success');
    }, (err: any) => {
        this.alertSer.error('Error');
    });
  }


  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog);
    // console.log("Selected Item:: ", item);
  }

  deleteInventory() {
    this.alertSer.wait();
    this.assetSer.deleteProduct(this.currentItem).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success('Success');
    }, (err: any) => {
      this.alertSer.error('Error');
    });
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.productMaster;
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
