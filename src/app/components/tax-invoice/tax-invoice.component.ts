import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from 'src/services/inventory.service';
import { jsPDF } from 'jspdf';
import { StorageService } from 'src/services/storage.service';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tax-invoice',
  templateUrl: './tax-invoice.component.html',
  styleUrls: ['./tax-invoice.component.css']
})
export class TaxInvoiceComponent {


  // @Input() newNote: any;
  @Input() inNumber: any;

  dialog: any;
Math: any;
  constructor(private http:HttpClient,
    private inventorySer: InventoryService,
    private storageSer :StorageService,
    public datepipe:DatePipe
  ) { }

  dcItems: any;
  invoiceNumber:any 
  ngOnInit(): void {
    this.inventorySer.invoiceNoSub.subscribe((res:any)=> {
      // console.log(res)
      this.invoiceNumber = res;
    })
    this.listInvoicesForReceipt()
    this.dcItems = this.storageSer.get('dcItems');
    // this.invoiceNumber = this.storageSer.get('invoice');
  }

  @ViewChild('table', { static: false }) table!: ElementRef;
  showSaveButton: boolean = true;
  newNote: any = [];
  generatePDF() {
    // const buttons = document.getElementById('buttons');
    // if (buttons) {
    //   buttons.classList.add('hidden-for-pdf');
    // }
    let pdfHeight: number;
    if(this.newNote.length < 50) {
      pdfHeight = 150
    } else {
      pdfHeight = 70
    }


    const doc = new jsPDF('p', 'mm', 'a4');
    const table = this.table.nativeElement;
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 30, 10, pdfHeight, 0);
      doc.save('table-data.pdf');
    });
  }



  data:any = [];
  listInvoicesForReceipt() {
    this.inventorySer.listInvoices({invoiceNo: this.invoiceNumber}).subscribe((res:any)=> {
      this.newNote = res;
    })
  }

  getTotalAmount(): number {
    return this.data.reduce((total:any, item:any) => total + (item.quantity  * item.cost) , 0);
  }

  getCeiledGrandTotal() {
    return Math.ceil(this.newNote[0]?.grandTotal || 0);
  }

  // getCeiledGrand() {
  //   return Math.ceil(this.newNote[0]?.sgst || 0);
  // }
  // getCeiledGrandTotall() {
  //   return Math.ceil(this.newNote[0]?.cgst || 0);
  // }

}
