import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css']
})
export class ProductMasterComponent implements OnInit {

  constructor(
    private inventorySer: InventoryService,
    private metaDataSer: MetadataService,
    public dialog: MatDialog,
    public alertSer: AlertService,
    private storageSer: StorageService,
  ) { }

  user: any;
  notFr = false;
  ngOnInit(): void {
    this.user =   JSON.parse(localStorage.getItem('user')!);
    for(let item of this.user?.role) {
      if(item == 'Administrator' || item == 'Support') {
        this.notFr = true;
      }
    }
    // this.getMetadata();
    this.listProduct();
    // this.filteredData = this.data.filter((item:any) => item.vendorName !== null);
  }

  showLoader = false;
  searchText: any;
  searchTx: any;
  productMaster: any = [];
  newProductMaster: any = [];
  active: any = [];

  vendorDetail: any;
  listProduct() {
    this.showLoader = true;
    this.inventorySer.listProduct().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.getMetadata();
      this.productMaster = res;
      this.newProductMaster = this.productMaster;
      // for(let item of this.productMaster) {
      //   if(item.statusId == 1) {
      //     this.active.push(item);
      //   }
      // }
    });
  }

  // filterProducts(type:any) {
  //     this.newProductMaster = this.productMaster.filter((item:any) => {
  //       return item.itemType == type
  //     })
  // }

  getVendorr() {
    // this.inventorySer.listVendors().subscribe((res: any) => {
    //   this.vendorDetail = res;
    // })
  }

  filterBody = {
    categoryId:  '',
    typeId:  '',
    statusId:  '',
    startDate:  '',
    endDate:  '',
    vendorId:  ''
  }

  // applyFilter() {
  //   this.inventorySer.filterProductMaster(this.filterBody).subscribe((res: any) => {
  //     console.log(res);
  //     this.newProductMaster = res;
  //   })
  // }

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

  showProduct: boolean = false;
  show(type: string) {
    if (type == 'product') {
      this.showProduct = true;
    }
  }

  closenow(type: String) {
    if (type == 'product') {
      this.showProduct = false;
    }
  }

  addressid = 0;
  addressView(e: any, i: any) {
    this.addressid = i;
    var x = e.target.nextElementSibling;
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
  }

  /* metadata methods */

  itemType: any;
  uomItem: any;
  quality:any;
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    // console.log(data)
    data?.forEach((item: any) => {
      if(item.type === 50) {
        this.itemType= item.metadata;
      } else if(item.type === 49) {
        this.uomItem = item.metadata;
      } else if(item.type === 54) {
        this.quality = item.metadata;
      }
    })
  }


  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  /* view inventory */

  @ViewChild('viewProductDialog') viewProductDialog = {} as TemplateRef<any>;
  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewProductDialog);
    // console.log(this.currentItem);
  }

  /* update inventory */
  @ViewChild('editProductDialog') editProductDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editProductDialog);
    // console.log(item);
  }


  Detail:any = []
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  open(item:any) {
    // console.log(item)
  this.inventorySer.ViewInvRawMaterials({itemCode:item?.suggestedItemCode}).subscribe((res: any) => {
    // console.log(res)
      this.Detail = res;
    })
    this.dialog.open(this.usedItemsDialog);
  }

  currentItem1:any
  @ViewChild('ItemsDialog') ItemsDialog = {} as TemplateRef<any>;
  openSecondData:any =[]
  openSecond(item:any) {
    console.log(item)
    this.currentItem1 = item
    this.inventorySer.listSareesPrices(item).subscribe((res:any)=> {
      console.log(res);
      this.openSecondData = res[0];
      console.log(this.openSecondData);
    })
    this.myobj.productionPrice = null;
    this.myobj.sellingPrice = null;
    this.dialog.open(this.ItemsDialog);
  }

  myobj = {
    productionPrice:null,
    sellingPrice:null,
    itemCode: null
  }

  Data:any
  UpdateProduct() {
    this.myobj.itemCode = this.currentItem1.suggestedItemCode
    this.myobj.productionPrice = this.openSecondData.productionPrice
    this.myobj.sellingPrice = this.openSecondData.sellingPrice
      this.inventorySer.updateSareesPrices(this.myobj).subscribe((res:any)=> {
      // console.log(res);
      if(res?.statusCode == 200) {
        this.alertSer.success(res?.message)
      } else {
        this.alertSer.error(res?.message)
      }

    })
  }

  onSelectChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "categoryId": null,
      "typeId": null,
      "vendorId": null,
      "modifiedBy": 1,

      "name": this.currentItem.name,
      "quantity": this.currentItem.quantity,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "model": this.currentItem.model,
      "cost": this.currentItem.cost,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    };

    let x = event.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "categoryId": null,
      "typeId": null,
      "vendorId": null,
      "modifiedBy": 1,

      "name": this.currentItem.name,
      "quantity": this.currentItem.quantity,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "model": this.currentItem.model,
      "cost": this.currentItem.cost,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    };

    let x = event.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onRadioChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "categoryId": null,
      "typeId": null,
      "vendorId": null,
      "modifiedBy": 1,

      "name": this.currentItem.name,
      "quantity": this.currentItem.quantity,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "model": this.currentItem.model,
      "cost": this.currentItem.cost,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    };
    let x = event.source.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  updateProductMaster() {
    this.originalObject = {
      "id": this.currentItem.id,
      "categoryId": null,
      "typeId": null,
      "vendorId": null,
      "modifiedBy": 1,
      "name": this.currentItem.name,
      "quantity": this.currentItem.quantity,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "model": this.currentItem.model,
      "cost": this.currentItem.cost,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    }
    this.inventorySer.updateProductMaster({productMaster: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listProduct();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  @ViewChild('deleteProductDialog') deleteProductDialog = {} as TemplateRef<any>;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteProductDialog);
  }

  deleteProduct() {
    this.alertSer.wait();
    this.inventorySer.deleteProduct(this.currentItem).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listProduct();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  showDetail: boolean = false;
  onShowDetail() {
    this.showDetail = !this.showDetail
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


  filteredData = [];
  
}
