import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseComponent } from 'src/app/purchase/purchase.component';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private ass: AssetService,
    private fb:UntypedFormBuilder,
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listPurchaseOrder();
    // this.getVendorr();
    // this.listOrderItems();
    this.getMetadata()
    this.form1()
    // this.form2()
  }
  addToInventoryForm:any = UntypedFormGroup
  UserForm2:any = UntypedFormGroup

  invoiceNumber: any;
  invoiceDate: any
  form1() {
    this.addToInventoryForm= this.fb.group({
      'poId': new UntypedFormControl(null),
    })
  }

  user:any
  // newcreateInventoryRawMaterials() {
  //   this.addToInventoryForm.value.poId = this.currentItem?.id;
  //   this.currentPurchaseItem.invoiceNumber = this.invoiceNumber;
  //   this.currentPurchaseItem.invoiceDate = this.invoiceDate;
  //   this.currentPurchaseItem.quantity = this.addToInventoryForm.value.quantity


  //   delete this.addToInventoryForm.value.quantity
  //   this.inventorySer.newcreateRawMaterials(this.addToInventoryForm.value, [this.currentPurchaseItem]).subscribe((res: any) => {
  //     this.invoiceNumber = '';
  //     this.invoiceDate = null; 
  //     this.addToInventoryForm.reset()
  //   })
  // }

  
  /* view inventory */
  currentPurchaseItem: any;
  @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;
  openViewPopup(item: any) {
    this.currentPurchaseItem = item;
    this.dialog.open(this.viewInventoryDialog);
  }

  // totalCost: any;
  // calculateTotalCost(): void {
  //   this.totalCost = this.tasks1.reduce((acc: any, curr: any) => acc + (curr.cost * curr.quantity), 0);
  // }
  
  proparatorTwo: boolean = false;
  proparatorThree: boolean = false;
  activeTwo() {
    this.proparatorTwo = !this.proparatorTwo;
    this.proparatorTwo ? (this.addToInventoryForm.get('sgst').setValue(null), this.addToInventoryForm.get('cgst').setValue(null)) : this.addToInventoryForm.get('igst').setValue(null)
  }

  showLoader = false;
  searchText: any;
  searchTx: any;
  ordersTable: any = [];
  newOrdersTable: any = [];
  orderItems: any = [];
  productIds: any;
  listPurchaseOrder() {
    this.showLoader = true;
    this.inventorySer.listPurchaseOrder().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.ordersTable = res;
      this.newOrdersTable = this.ordersTable;
    });
  }
  

  


  newNote:any; 
  openForm(item:any) {
    this.inventorySer.purchaseSub.next(item.purchaseRef);
    this.dialog.open(PurchaseComponent, {width: '50vw', height: '100vh'});
  }

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;
  oenEdit(item:any) {
    this.currentItem = item
    this.dialog.open(this.editInventoryDialog)
  }


  @ViewChild('viewInventoryItemsDialog') viewInventoryItemsDialog = {} as TemplateRef<any>;
  listPurchaseOrderItemsData:any
  open(item:any) {
    this.currentItem = item;
    this.inventorySer.listPurchaseOrderItems(item).subscribe((res: any)=> {
      res.forEach((element: any) => {
        element.quantity = null;
        element.invoiceNumber = null;
        element.invoiceDate = null;
      });
      this.listPurchaseOrderItemsData = res;
    })
    this.dialog.open(this.viewInventoryItemsDialog);
  }

  listOrderItems() {
    this.showLoader = true;
    this.inventorySer.listOrderItemsById(this.orderItemsId.id).subscribe((res: any) => {
      this.showLoader = false;
      this.orderItems = res;
    });
  }





  brandNames: any;
  categoryTypes: any;
  statusVal: any;
  removeDuplicates() {
    this.brandNames = this.ordersTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productBrand == current.productBrand);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.categoryTypes = this.ordersTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productCategory == current.productCategory);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.statusVal = this.ordersTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.status == current.status);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

 
  ovendorId: any = '';
  oinvoiceId: any = null;
  ostartDate: any = null;
  oendDate: any = null;

  applyFilter() {
    let myObj = {
      'vendorId': this.ovendorId ? this.ovendorId : -1,
      'invoiceNo': this.oinvoiceId ? this.oinvoiceId : '',
      'startDate': this.ostartDate ? this.ostartDate : '',
      'endDate': this.oendDate ? this.oendDate : '',
    }
    this.inventorySer.filterOrders(myObj).subscribe((res: any) => {
      this.newOrdersTable = res;
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

  showInventory: boolean = false;
  closenow(value: any, type: String) {
    if (type == 'vendor') {
      this.showInventory = value;
    }
  }

  show(type: string) {
    if (type == 'vendor') {
      this.showInventory = true;
    }
  }

  currentItem: any;
  originalObject: any;
  changedKeys: any = [];


  /* update inventory */
  // @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;
  // openEditPopup(item: any) {
  //   this.currentItem = item;
  //   this.dialog.open(this.editInventoryDialog, { maxWidth: '550px', maxHeight: '550px'});
  // }

  updateOrder() {
    this.originalObject = {
      'id': this.currentItem.id,
      'quantity': this.currentItem.orderQuantity
    
      // 'remarks': this.currentItem.remarks
    }
    this.inventorySer.updateOrder(this.originalObject).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        // this.listOrders();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog, { maxWidth: '550px', maxHeight: '550px'});
  }

  deleteInventory() {
    this.alertSer.wait();
    this.inventorySer.deleteOrder(this.currentItem).subscribe((res: any) => {
      if(res) {
        this.alertSer.success(res?.message);
        this.listPurchaseOrder();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  @ViewChild('orderItemsDialog') orderItemsDialog = {} as TemplateRef<any>;
  orderItemsId: any;
  openOrderItems(item: any) {
    this.orderItemsId = item;
    this.inventorySer.listOrderItemsById(this.orderItemsId.id).subscribe((res: any) => {
      this.orderItems = res;
    });
    this.dialog.open(this.orderItemsDialog, { maxWidth: '550px', maxHeight: '550px'});
    // console.log(item);
  }


  @ViewChild('createOrderDialog') createOrderDialog = {} as TemplateRef<any>;
  openCreateOrder(item: any) {
    // console.log(item)
    this.orderItemsId = item;
    this.dialog.open(this.createOrderDialog,{ maxWidth: '550px', maxHeight: '550px'});
  }

  orderItemBody = {
    orderId: null,
    productId: null,
    productQuantity: null,
    createdBy: 1,
    remarks: null
  }

  addItemToOrder() {
    this.orderItemBody.orderId = this.orderItemsId?.id;
    this.inventorySer.addItemToOrder(this.orderItemBody).subscribe((res: any) => {
      if(res) {
        this.alertSer.success(res?.message);
        this.listOrderItems();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      }
    })
  }

  @ViewChild('updateOrderDialog') updateOrderDialog = {} as TemplateRef<any>;

  openUpdateOrder(item: any) {
    this.currentItem = item;
    this.dialog.open(this.updateOrderDialog, { maxWidth: '550px', maxHeight: '550px'});
  }

  updateOrderItem() {
    this.originalObject = {
      'id': this.currentItem.id,
      'productQuantity': this.currentItem.productQuantity,
      'by': 1
    }
    this.alertSer.wait();
    this.inventorySer.updateOrderItem(this.originalObject).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listOrderItems();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  @ViewChild('deleteOrderItemsDialog') deleteOrderItemsDialog = {} as TemplateRef<any>;
  opendeleteOrderItem(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteOrderItemsDialog, { maxWidth: '250px', maxHeight: '250px'});
  }

  deleteOrderItem() {
    this.inventorySer.deleteOrderItem(this.currentItem).subscribe((res: any) => {
      if(res) {
        this.alertSer.success(res?.message);
        this.listOrderItems();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }
  filterOrderItems() {}


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.ordersTable;
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
    for (var i = 0; i < this.listPurchaseOrderItemsData.length; i++) {
      this.listPurchaseOrderItemsData[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.listPurchaseOrderItemsData.every(function (item: any) {
      return item.selected == true;
    })
  }

  addedOrderList: any = [];
  currentRawItem: any;
  addChecked(item: any, i: any, e: any) {
    delete item.id;
    this.currentRawItem = item;
    var checked = (e.target.checked);

    if (checked == true && this.addedOrderList.includes(item) == false) {
      this.addedOrderList.push(item);
      this.currentPurchaseItem = this.addedOrderList[(this.addedOrderList.length - 1)];
    }
    if (checked == false && this.addedOrderList.includes(item) == true) {
      this.addedOrderList.splice(this.addedOrderList.indexOf(item), 1)
    }
  }

  addMultiple() {
    if(this.addedOrderList.length === 0) {
      this.alertSer.error('Please select atleast one item!')
    } else {
      this.addedOrderList.forEach((item:any) => {
        delete item.orderQuantity;
        delete item.poId;
        delete item.remarks;
        delete item.quantityIn;
        delete item.modifiedBy;
        delete item.modifiedTime;
        delete item.createdTime;
        delete item.amount;
      });
      this.addToInventoryForm.value.poId = this.currentItem?.id;
      this.inventorySer.createRawMaterials(this.addToInventoryForm.value, this.addedOrderList).subscribe((res: any) => {
        // console.log(res);
        if(res.statusCode === 200) {
          this.alertSer.success(res?.message)
          this.dialog.closeAll();
          this.addedOrderList = [];
        } else {
          this.alertSer.error(res.message);
          this.addedOrderList = [];
        }
      });
    }
  }

  Weavers_Item_Uom:any
  partType: any;
  partCategory: any;
  partCode: any;
  buildType: any;
  Weavers_Quality:any
  getMetadata() {
    this.metaDatSer.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 54) {
          this.Weavers_Quality = item.metadata;
        } else if(item.type == 49) {
          this.Weavers_Item_Uom = item.metadata;
        } else if(item.type == 'part_code') {
          this.partCode = item.metadata;
        } else if(item.type == 'build_type') {
          this.buildType = item.metadata;
        }
      }
    })
  }

}
