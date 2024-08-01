import { Component, OnInit , EventEmitter, HostListener,  Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { DatePipe } from '@angular/common';
import { GoodReceiptComponent } from '../good-receipt/good-receipt.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-raw-materials',
  templateUrl: './raw-materials.component.html',
  styleUrls: ['./raw-materials.component.css']
})
export class RawMaterialsComponent implements OnInit {
  constructor(
    private inventorySer: InventoryService,
    private metadataSer: MetadataService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private route: ActivatedRoute
  ) { }
  user: any;
  notFr = false;
  // ngOnInit(): void {
  //   this.user =   JSON.parse(localStorage.getItem('user')!);
  //   for(let item of this.user?.role) {
  //     if(item == 'Administrator' || item == 'Support') {
  //       this.notFr = true;
  //     }
  //   }
  //   this.listInventoryForRaw()
  // }

  selectedItemId: any;

  selectedItemName: any;

  ngOnInit(): void {


    this.inventorySer.itemNameSource.subscribe({
      next: (res) => {
        this.selectedItemName = res;
      }
    })
    
    this.listInventoryForRaw()
  }
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  openInvoice() {
    this.inventorySer.listGoodReceiptNote().subscribe((res:any)=> {
      this.note = res;
      // console.log(this.note)
    })
    this.dialog.open(this.usedItemsDialog)
  }



  note:any;
  listGoodReceiptNote() {
    this.inventorySer.listGoodReceiptNote().subscribe((res:any)=> {
      this.note = res;
    })
  }

  data:any
  @ViewChild('statusItemsDialogTwo') statusItemsDialogTwo = {} as TemplateRef<any>;
  ViewInvRawMaterials(item:any) {
    // console.log(item)
    this.inventorySer.ViewInvRawMaterials(item).subscribe((res:any)=> {
      this.data = res;
      // console.log(this.data)
    })
    this.dialog.open(this.statusItemsDialogTwo)
  }




  noteSecond:any
  @ViewChild('ItemsDialog') ItemsDialog = {} as TemplateRef<any>;
  open(item:any) {
    this.inventorySer.listGoodReceiptNote(item).subscribe((res:any)=> {
      this.noteSecond = res;
    })
    this.dialog.open(this.ItemsDialog)
  }

  // newNote: any;
  // @ViewChild('taxInvoiceDialog') taxInvoiceDialog = {} as TemplateRef<any>;
  // @ViewChild(GoodReceiptComponent) goodRecieptComp: any
  taxData(item:any) {
    // this.inventorySer.listGoodReceiptNote(item).subscribe((res:any)=> {
    //   this.newNote = res;
    // });
    this.inventorySer.goodRecieptSub.next(item);
    this.dialog.open(GoodReceiptComponent);
  }

  
  searchText:any
  showLoader:boolean = false;
  main:boolean = false;;
  openRaw(type:any) {
    // if(type == 'raw') {
    //   this.main = true;
    //   this.fi = true
    //   this.filterBody.startDate = null;
    //   this.filterBody.endDate = null;
    // }
    // else if(type == 'finished') {
    //   this.main = false;
    //   this.fi = false
    //   this.filterBody1.startDate = null;
    //   this.filterBody1.endDate = null;
    // }
  }

  showProduct: boolean = false;
  show(type: string) {
    if (type == 'raw') {
      this.showProduct = true;
    }
  }
  closenow(type: String) {
    if (type == 'raw') {
      this.showProduct = false;
    }
  }
  mainDataRaw:any = [];
  FinalData:any;
  listInventoryForRaw() {
    this.inventorySer.listInventoryForRaw().subscribe((res:any)=> {
      // console.log(res);
      this.FinalData = res;
      this.mainDataRaw = this.FinalData
    })
  }
  filterBody = {
    startDate: null,
    endDate: null,
  }
  filterForRaw() {
    // this.ra = true;
    this.inventorySer.filterForRaw(this.filterBody).subscribe((res: any) => {
      // console.log(res);
      this.mainDataRaw = res;
      this.filterBody.startDate = null;
        this.filterBody.endDate = null;
    })
  }
  inventoryStatus: any;
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    data?.forEach((item: any) => {
      if(item.type == 'Weavers_Inventory_Status') {
        this.inventoryStatus = item.metadata;
      }
    })
  }
  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.FinalData;
    // var y = this.inventoryItems;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
      // y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
      // y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sorted1 = false;
  sort1(label: any) {
    this.sorted = !this.sorted;
    var x = this.note;
    // var y = this.inventoryItems;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
      // y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
      // y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
