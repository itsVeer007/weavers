import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    // var y = <HTMLElement>document.getElementById(`address${this.addressid}`);

    // console.log(`plus-img${this.currentid}`);
    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    // if (y != null) {
    //   if(!y.contains(e.target)) {
    //     if (y.style.display == 'flex' || y.style.display == 'block') {
    //       y.style.display = 'none';
    //     }
    //   }
    // }
  }




  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listVendors();
  }


  searchText: any;
  searchTx: any;
  vendorTable: any = [];
  newVendorTable: any = [];

  active: any = [];
  inActive: any = [];
  listVendors() {
    this.showLoader = true;
    this.inventorySer.listVendors().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.vendorTable = res;
      this.newVendorTable = this.vendorTable;
      for(let item of this.vendorTable) {
        if(item.statusId == 1) {
          this.active.push(item);
        }
      }
    });
  }


  brandNames: any;
  categoryTypes: any;
  statusVal: any;
  removeDuplicates() {
    this.brandNames = this.vendorTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productBrand == current.productBrand);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.categoryTypes = this.vendorTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productCategory == current.productCategory);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.statusVal = this.vendorTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.status == current.status);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  vendorStatus: any
  getMetadata() {
    this.metaDatSer.getMetadata().subscribe((res: any) => {
      // console.log(res);
      res?.forEach((item: any) => {
        if(item.type == 'Ticket_Status') {
          this.statusVal = item.metadata;
        } else if(item.type == "Vendor_Status") {
          this.vendorStatus = item.metadata;
        }
      })
    })
  }

  // prBrand: any = null;
  // sta: any = null;
  // prCat: any = null;
  // applyFilter() {
  //   let myObj = {
  //     productBrand: this.prBrand ? this.prBrand : '',
  //     status: this.sta ? this.sta : '',
  //     productCategory: this.prCat ? this.prCat : '',
  //   }

  //   this.inventorySer.filteBody(myObj).subscribe((res: any) => {
  //     // console.log(res);
  //     this.newVendorTable = res;
  //   })
  // }

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

  closenow(value: any, type: String) {
    if (type == 'vendor') {
      this.showVendor = value;
      }
  }

  showVendor:boolean = false
  // showInventory: boolean = false;

  show(type: string) {
    if (type == 'vendor') {
      this.showVendor = true; 
      }
  }


  @ViewChild('itemsDialog') itemsDialog = {} as TemplateRef<any>;

  itemDetail: any
  listVendorsById(i: any) {
    this.inventorySer.listVendorsById(i.id).subscribe((res: any) => {
      this.itemDetail = res;
      this.dialog.open(this.itemsDialog);
    })
  }


  @ViewChild('proprietorDialog') proprietorDialog = {} as TemplateRef<any>;

  currentDetail: any;
  openProprietorDialog(i: any) {
    this.currentDetail = i;
    this.dialog.open(this.proprietorDialog);
  }


  @ViewChild('addressDialog') addressDialog = {} as TemplateRef<any>;

  addressId: any;
  addressView(i: any) {
    this.addressId = i;
    this.dialog.open(this.addressDialog)
  }


  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  /* view inventory */

  @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;
  openlistVendorDetails(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewInventoryDialog);
    this.inventorySer.listVendorDetails(item).subscribe((res:any)=> {
      // console.log(this.currentItem);
      this.currentItem = res;
      console.log(this.currentItem)
    })
  }

  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;
  openlistVendorDetailss() {
    this.dialog.open(this.deleteInventoryDialog);
  }


  /* update inventory */

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editInventoryDialog);
    // console.log(item);
  }

  onInputChange(e: any) {
    this.originalObject = {
      'id': this.currentItem.id,
      'name': this.currentItem.name,
      'proprietorName1': this.currentItem.proprietorName1,
      'proprietorName2': this.currentItem.proprietorName2,
      'proprietorName3': this.currentItem.proprietorName3,
      'emailId1': this.currentItem.emailId1,
      'emailId2': this.currentItem.emailId2,
      'emailId3': this.currentItem.emailId3,
      'mobileNumber1': this.currentItem.mobileNumber1,
      'mobileNumber2': this.currentItem.mobileNumber2,
      'mobileNumber3': this.currentItem.mobileNumber3,
      'statusId': this.currentItem.statusId,
      'serviceStartDate': null,
      'serviceEndDate': this.currentItem.serviceEndDate,
      'createdBy': null,
      'modifiedBy': 0,
      'createdTime': null,
      'modifiedTime': null,
      'addressLine1': this.currentItem.addressLine1,
      'addressLine2': this.currentItem.addressLine2,
      'postCode': this.currentItem.postCode,
      'country': this.currentItem.country,
      'state': this.currentItem.state,
      'city': this.currentItem.city,
      'remarks': this.currentItem.remarks
    };

    let x = e.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(e: any) {
    this.originalObject = {
      'id': this.currentItem.id,
      'name': this.currentItem.name,
      'proprietorName1': this.currentItem.proprietorName1,
      'proprietorName2': this.currentItem.proprietorName2,
      'proprietorName3': this.currentItem.proprietorName3,
      'emailId1': this.currentItem.emailId1,
      'emailId2': this.currentItem.emailId2,
      'emailId3': this.currentItem.emailId3,
      'mobileNumber1': this.currentItem.mobileNumber1,
      'mobileNumber2': this.currentItem.mobileNumber2,
      'mobileNumber3': this.currentItem.mobileNumber3,
      'statusId': this.currentItem.statusId,
      'serviceStartDate': null,
      'serviceEndDate': this.currentItem.serviceEndDate,
      'createdBy': null,
      'modifiedBy': 0,
      'createdTime': null,
      'modifiedTime': null,
      'addressLine1': this.currentItem.addressLine1,
      'addressLine2': this.currentItem.addressLine2,
      'postCode': this.currentItem.postCode,
      'country': this.currentItem.country,
      'state': this.currentItem.state,
      'city': this.currentItem.city,
      'remarks': this.currentItem.remarks
    };

    let x = e.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  updatevendor() {
    this.originalObject = {
      'id': this.currentItem.id,
      'name': this.currentItem.name,
      'proprietorName1': this.currentItem.proprietorName1,
      'proprietorName2': this.currentItem.proprietorName2,
      'proprietorName3': this.currentItem.proprietorName3,
      'emailId1': this.currentItem.emailId1,
      'emailId2': this.currentItem.emailId2,
      'emailId3': this.currentItem.emailId3,
      'mobileNumber1': this.currentItem.mobileNumber1,
      'mobileNumber2': this.currentItem.mobileNumber2,
      'mobileNumber3': this.currentItem.mobileNumber3,
      'statusId': this.currentItem.statusId,
      'serviceStartDate': null,
      'serviceEndDate': this.currentItem.serviceEndDate,
      // 'createdBy': null,
      'modifiedBy': 0,
      'createdTime': null,
      'modifiedTime': null,
      'addressLine1': this.currentItem.addressLine1,
      'addressLine2': this.currentItem.addressLine2,
      'postCode': this.currentItem.postCode,
      'country': this.currentItem.country,
      'state': this.currentItem.state,
      'city': this.currentItem.city,
      'remarks': this.currentItem.remarks
    }
    this.inventorySer.updatevendor({vendor: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
        this.alertSer.success(res?.message);
        this.listVendors();
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  // @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog);
  }

  deleteVendor() {
    this.alertSer.wait();
    this.inventorySer.deleteVendor(this.currentItem).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listVendors();
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
    var x = this.vendorTable;
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


 /* checkbox control */

 selectedAll: any;
 selectAll() {
   for (var i = 0; i < this.vendorTable.length; i++) {
     this.vendorTable[i].selected = this.selectedAll;
   }
 }

 checkIfAllSelected() {
   this.selectedAll = this.vendorTable.every(function (item: any) {
     return item.selected == true;
   })
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

  // viewBySelectedOne() {
  //   if (this.viewArray.length > 0) {
  //     this.dialog.open(this.viewInventoryDialog)
  //   }
  // }

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
      this.dialog.open(this.editInventoryDialog)
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
        // this.deleteInventory();
        this.vendorTable = this.vendorTable.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.vendorTable.forEach((el: any) => {
        this.vendorTable = this.vendorTable.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

}
