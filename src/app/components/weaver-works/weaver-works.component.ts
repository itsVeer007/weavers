import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { error } from 'console';
// import { format } from 'path';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-weaver-works',
  templateUrl: './weaver-works.component.html',
  styleUrls: ['./weaver-works.component.css']
})
export class WeaverWorksComponent implements OnInit {

  fb: any;
  constructor(
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService
  ) { }

  user: any;
  notFr = false;
  ngOnInit(): void {
    
    // this.listInventory();
    // this.listOrderItems();
    // this.listIndent();
    this.listProduct();
    this.listMachineAssignment();
    this.user =   JSON.parse(localStorage.getItem('user')!);
    for(let item of this.user?.role) {
      if(item == 'Administrator' || item == 'Support') {
        this.notFr = true;
      }
    }
  }

  showLoader = false;
  searchText: any;
  searchTx: any;
  indentTable: any = [];
  newIndentTable: any = [];
  orderItems: any = [];
  newOrderItems: any = [];
  requested: any = [];
  dispatched: any = [];
  received: any = [];
  installed: any = [];
  returned: any = [];
  productIds: any;
  inventoryDetail: any;
  // listIndent() {
  //   this.showLoader = true;
  //   this.inventorySer.listIndent().subscribe((res: any) => {
  //     // console.log(res);
  //     this.showLoader = false;
  //     this.getMetadata();
  //     this.indentTable = res;
  //     this.newIndentTable = this.indentTable;
  //     for(let item of this.indentTable) {
  //       if(item.statusId == 1) {
  //         this.requested.push(item);
  //       } else if(item.statusId == 2) {
  //         this.dispatched.push(item)
  //       }else if(item.statusId == 3) {
  //         this.received.push(item)
  //       }else if(item.statusId == 4) {
  //         this.installed.push(item)
  //       }else if(item.statusId == 5) {
  //         this.returned.push(item)
  //       }
  //     }
  //   });
  // }

  listMachineAssignment() {
    // console.log(item)
    this.inventorySer.listMachineAssignment().subscribe((res:any)=> {
      // console.log(res);
      this.indentTable = res
      this.getMetadata()
      this.listOutputSarees()
    })
  }
  // .sort((a:any,b:any)=> a.weaverId > b.weaverId ? -1 : a.weaverId < b.weaverId ? 1 : 0);


  filteredProducts: any;
removeDuplicates() {
  this.filteredProducts = this.indentTable.reduce((acc: any, current: any) => {
    const x = acc.find((item: any) => {
      if(item.weaverId == current.weaverId &&
        item.weaverName == current.weaverName &&
        item.machineNoAliasInventoryId == current.machineNoAliasInventoryId &&
        item.expectedDate == current.expectedDate
        // item.price == current.price && 
        // item.cost == current.cost &&
        // item.itemCode == current.itemCode
        ) {
          return true;
        } else {
          false;
        }
        return
      });
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
    }
  }, []);
  // console.log(this.filteredProducts)
}


  listProduct() {
    this.inventorySer.listProduct().subscribe((res: any) => {
      this.productIds = res;
    });
  }

  outPut:any
  listOutputSarees() {
    // console.log()
    // this.currentItem = data;
    this.inventorySer.listOutputSarees().subscribe((res: any) => {
      this.outPut = res;
    });
  }



  @ViewChild('viewDetailsDialog') viewDetailsDialog = {} as TemplateRef<any>;
  inventoryItems: any;
  currentItem1: any
  openviewDetailsDialog(data: any) {
    console.log(data)
    this.currentItem1 = data;
    this.inventorySer.listMachineAssignment(data).subscribe((res: any) => {
      this.inventoryItems = res;
      console.log(this.inventoryItems)
    })
    this.dialog.open(this.viewDetailsDialog);
  }

  sareeSelection: any;
  date:any = new Date();
  updateSarees() {
    let myObj = {
      [this.sareeSelection]: formatDate(this.date, 'yyyy-MM-dd', 'en-us'),
      'p_ir_machine_assignment_id': this.currentItem1?.machineAssignmentId
    };

    this.inventorySer.updateSarees(myObj).subscribe((res:any) => {
      // console.log(res);
      if(res.statusCode === 200) {
        this.alertSer.success(res?.message)
      } 
      this.listOutputSarees();
      this.listMachineAssignment()
    },(error)=> {
      // this.alertSer.error('Already Updated')
    }
  )
    // this.date = null;
    // this.sareeSelection = null
  }


  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  ViewOutSareeInInvData:any
  ViewOutSareeInInv(item:any) {
    console.log(item)
    this.currentItem = item
    this.inventorySer.ViewOutSareeInInv(this.currentItem).subscribe((res:any)=> {
      console.log(res)
      this.ViewOutSareeInInvData = res;
      this.listMachineAssignment();
    })
    this.dialog.open(this.usedItemsDialog)
  }

  // listInventory() {
  //   this.inventorySer.listInventory().subscribe((res: any) => {
  //     this.inventoryDetail = res;
  //   });
  // }

  // @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;
  // openview(item: any) {
  //   console.log(item);
  //   this.currentItem = item;
  //   this.inventorySer.listOutputSarees().subscribe((res: any) => {
  //     this.outPut = res;
  //   });
  //   this.dialog.open(this.viewInventoryDialog);
  // }



  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;
  openMachine(data:any) {
    console.log(data)
    this.dialog.open(this.deleteInventoryDialog);
    this.currentItem = data;
    this.inventorySer.listMachineAssignment(data).subscribe((res:any)=> {
      console.log(res);
      this.newIndentTable = res;
    })
  }
  listOrderItems() {
    this.showLoader = true;
    this.inventorySer.listOrderItems().subscribe((res: any) => {
      this.showLoader = false;
      this.orderItems = res;
      this.newOrderItems = this.orderItems;
    });
  }

  ojobOrTicketId: any = null;
  oproductId: any = null;
  ostatus: any = null;
  ostartDate: any = null;
  oendDate: any = null;

  applyFilter() {
    let myObj = {
      jobOrTicketId: this.ojobOrTicketId ? this.ojobOrTicketId : -1,
      productId: this.oproductId ? this.oproductId : -1,
      status: this.ostatus ? this.ostatus : -1,
      startDate: this.ostartDate ? this.ostartDate : '',
      endDate: this.oendDate ? this.oendDate : ''
    }

    this.inventorySer.filterIndent(myObj).subscribe((res: any) => {
      this.newIndentTable = res;
    })
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


  fromParent:any;
  showIndent: boolean = false;
  show(type: string ,data:any) {
    this.fromParent = data
    if (type == 'indent') {
      this.showIndent = true;
    } 
  }

  closenow() {
    this.showIndent = false;
  }

  Weavers_Output_Sarees: any;
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    for(let item of data) {
      if(item.type == 83) {
        this.Weavers_Output_Sarees = item.metadata;
        // console.log(this.Weavers_Output_Sarees)
      }
    }
  }

  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  /* view inventory */

  @ViewChild('DetailsDialog') DetailsDialog = {} as TemplateRef<any>;
  open(data: any) {
    // console.log(data)
    this.sareeSelection = null;
    this.currentItem1 = data;
    this.dialog.open(this.DetailsDialog);
  }



  /* update inventory */

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;
  inventorySerial: any;
  openEditPopup(item: any) {
      console.log(item);
    this.currentItem = item;
    this.dialog.open(this.editInventoryDialog);
    this.inventorySer.listInventoryByProductId(item.productId).subscribe((res: any) => {
      console.log(res);
      for(let item of this.inventoryDetail) {
        if(item.inventoryStatusId == 1) {
          this.inventorySerial = res;
        }
      }
    })
  }

  // updateInventoryId: any;
  // updateIndent() {
  //   this.originalObject = {
  //     'id': this.currentItem.id,
  //     'statusId': this.currentItem.statusId,
  //     'updatedBy': this.user?.UserId,
  //     'inventoryId': this.updateInventoryId,
  //     'remarks': this.currentItem.remarks
  //   }

  //   this.inventorySer.updateIndentStatus(this.originalObject).subscribe((res: any) => {
  //     // console.log(res);
  //       this.alertSer.success(res?.message);
  //       this.listIndent();
  //   }, (err: any) => {
  //     if(err) {
  //       this.alertSer.error(err?.error?.message);
  //     };
  //   });
  // }


  // @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  // openDeletePopup(item: any) {
  //   this.currentItem = item;
  //   this.dialog.open(this.deleteInventoryDialog);
  // }

  // deleteIndent() {
  //   this.alertSer.wait();
  //   this.inventorySer.deleteIndent(this.currentItem).subscribe((res: any) => {
  //     if(res) {
  //       this.alertSer.success(res?.message);
  //       this.listIndent();
  //     }
  //   }, (err: any) => {
  //     if(err) {
  //       this.alertSer.error(err?.error?.message);
  //     };
  //   });
  // }


  @ViewChild('createOrderDialog') createOrderDialog = {} as TemplateRef<any>;
  openCreateOrder() {
    // this.currentItem = item;
    this.dialog.open(this.createOrderDialog);
  }

  centralboxBody = {
    centralBoxId: null,
    inventoryId: null,
    createdBy: null
  }

  addComponent() {
    this.centralboxBody.createdBy = this.user?.UserId;
    this.inventorySer.addComponent(this.centralboxBody).subscribe((res: any) => {
      // console.log(res)
    })
  }


  @ViewChild('replaceComponentDialog') replaceComponentDialog = {} as TemplateRef<any>;
  openReplaceComponent() {
    this.dialog.open(this.replaceComponentDialog);
  }

  body = {
    oldInventoryId: null,
    newInventoryId: null,
    replacedBy: 1
  }
  replaceComponent() {
    this.inventorySer.replaceComponent(this.body).subscribe((res: any) => {
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



  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;
  statusObj = {
    // this.currentStatusId
    statusId: null,
    inventoryId: null,
    createdBy: null
  }

  currentStatusId: any;
  invenIds: any = null;
  openEditStatus(id: any) {
    this.currentStatusId = id;
    this.statusObj.statusId = null;
    this.statusObj.inventoryId = null;
    this.dialog.open(this.editStatusDialog);
    this.inventorySer.listInventoryByItemCode(id).subscribe((res: any) => {
      this.invenIds = res;
    })
  }


  // updateInventoryStatus() {
  //   this.statusObj.createdBy = this.user?.UserId;
  //   this.inventorySer.updateIndentStatus(this.currentStatusId, this.statusObj).subscribe((res: any) => {
  //     // console.log(res);
  //     this.alertSer.success(res?.message);
  //     this.listIndent();
  //   }, (err: any) => {
  //     this.alertSer.error(err?.error?.message);
  //   });
  // }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.indentTable;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }
  sort1(label: any) {
    this.sorted = !this.sorted;
    var x = this.inventoryItems;
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
    for (var i = 0; i < this.indentTable.length; i++) {
      this.indentTable[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.indentTable.every(function (item: any) {
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
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        // this.currentItem = el;
        // this.deleteInventory();
        this.indentTable = this.indentTable.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.indentTable.forEach((el: any) => {
        this.indentTable = this.indentTable.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

  items: any = [];
  onTaskAdd(item: any) {
    // console.log(item)
    if(item != '') {
      this.items.push(item)
      // this.UserForm.get('machineSubcomponents').setValue(null);
      // console.log(this.items);
    } else {
      this.alertSer.error('Please fill all fields');
    }
    // if(item?.itemCode == null || item?.quantity == null) {
    //   this.alertSer.error('Please fill all fields');
    // } else {
    //   let machineAssignment = {
    //     'weaverId': item.weaverId,
    //     'weaverName': item.weaverName,
    //     'machineNo':item.machineNo
    //   }
    //   this.items.push(machineAssignment);
    //   this.UserForm.get('weaverId').setValue(null);
    //   this.UserForm.get('weaverName').setValue(null);
    //   this.UserForm.get('machineNo').setValue(null);
    // }
  }

  // submit() {
  //   if(this.UserForm.valid) {
  //     this.createMachineAssignment.createdBy = this.user?.UserId;
  //     if(this.items.length > 0) {
  //       this.createMachineAssignment.machineSubcomponents = this.items
  //       // this.alertSer.wait();
  //       this.inventorySer.createMachineAssignment(this.createMachineAssignment).subscribe((res: any) => {
  //         // console.log(res);
  //         this.newItemEvent.emit();
  //         this.alertSer.success(res?.message);
  //       }, (err: any) => {
  //         if(err) {
  //           this.alertSer.error(err?.error?.message);
  //         }
  //       });
  //     } 
  //     else {
  //       this.alertSer.error('Please add atleast one task')
  //     }
  //   }
  // }
}
