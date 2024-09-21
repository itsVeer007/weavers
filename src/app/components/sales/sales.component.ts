import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';
import { TaxInvoiceComponent } from '../tax-invoice/tax-invoice.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private assetSer: AssetService,
    private siteSer: SiteService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService
  ) { }

  ngOnInit(): void {
    this.listInvoices();
    // this.listInvoicesForReceipt();
    // this.getStatus();
  }


  showSales: any;
  show(type: string) {
    if (type == 'device') {
      this.showSales = true;
    }

  }

  close(type: any) {
    if (type == 'device') {
      this.showSales = false;
    }
  }

  newSiteData: any = [];
  siteData: any = [];
  listInvoices() {
    this.inventorySer.listInvoices().subscribe((res: any) => {
      // console.log(res);
      this.siteData = res;
      this.newSiteData = this.siteData;
    });
  }

  filterBody = {
    startDate: null,
    endDate: null
  }

  filter() {
    this.inventorySer.listInvoices(this.filterBody).subscribe((res: any) => {
      // console.log(res)
      this.newSiteData = res;
      this.filterBody.startDate = null;
      this.filterBody.endDate = null;
    })
  }


  // data:any = [];
  // listInvoicesForReceipt() {
  //   this.inventorySer.listInvoices().subscribe((res:any)=> {
  //     // console.log(res);
  //     this.data = res;
  //   })
  // }


  return:any
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  openReturnItems(item:any) {
    console.log(item)
    this.inventorySer.listReturnItems(item).subscribe((res:any)=> {
      console.log(res)
      this.return = res;
    })
    this.dialog.open(this.usedItemsDialog)
  }

  note: any
  @ViewChild('ItemsDialog') ItemsDialog = {} as TemplateRef<any>;
  open(item: any) {
    // console.log(item)
    this.checked = false;
    this.viewArray = []
    this.inventorySer.listInvoices(item).subscribe((res: any) => {
      // res.items.forEach((el: any) => {
      //   el.qty = null;
      // })
      this.note = res.items;
    })
    this.dialog.open(this.ItemsDialog)
  }
  search: any


  final: any
  // newNote: any;
  // @ViewChild('taxInvoiceDialog') taxInvoiceDialog = {} as TemplateRef<any>;
  openInvoice(item: any) {
    this.inventorySer.invoiceNoSub.next(item.invoiceNo);
    this.dialog.open(TaxInvoiceComponent);
  }



  searchText: any;
  deviceData: any = [];
  newDeviceData: any = [];
  active: any = [];
  inActive: any = [];
  // listDeviceBySiteId(siteId: any) {
  //   this.showLoader = true;
  //   this.assetSer.listDeviceBySiteId(siteId).subscribe((res: any) => {
  //     // console.log(res);
  //     this.showLoader = false;
  //     this.filterObj.siteId = this.siteData[0]?.siteid;
  //     this.deviceData = res.flatMap((item: any) => item.adsDevices);
  //     this.newDeviceData = this.deviceData;
  //     this.active = [];
  //     this.inActive = []
  //     for(let item of this.newDeviceData) {
  //       if(item.status == 1) {
  //         this.active.push(item);
  //       } else if(item.status == 2) {
  //         this.inActive.push(item);
  //       }
  //     }
  //   })
  // }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.note;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }





  // /* checkbox control */
  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.siteData.length; i++) {
      this.siteData[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.siteData.every(function (item: any) {
      return item.selected == true;
    })
  }

  viewArray: any = [];
  checked: boolean = false;
  addChecked(item: any, i: any, e: any) {
    // console.log(item);

    this.checked = (e.target.checked);
    if (this.checked && !this.viewArray.includes(item)) {
      this.viewArray.push(item);
      //  this.currentPurchaseItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (!this.checked && this.viewArray.includes(item)) {
      this.viewArray.splice(this.viewArray.indexOf(item), 1)
    }
  }

  updateOrder() {
    this.inventorySer.updateReturnItems(this.viewArray).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.alertSer.success(res?.message)
        this.dialog.closeAll();
      } else {
        this.alertSer.error(res.message);
      }
    })
  }

}
