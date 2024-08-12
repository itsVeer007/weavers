import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from 'src/services/inventory.service';
import { jsPDF } from 'jspdf';
import { StorageService } from 'src/services/storage.service';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { Config, NgxPrintElementService } from 'ngx-print-element';

@Component({
  selector: 'app-tax-invoice',
  templateUrl: './tax-invoice.component.html',
  styleUrls: ['./tax-invoice.component.css']
})
export class TaxInvoiceComponent {


  // @Input() newNote: any;
  // @Input() inNumber: any;

dialog: any;
Math: any;
  constructor(private http:HttpClient,
    private inventorySer: InventoryService,
    private storageSer :StorageService,
    public datepipe:DatePipe,
    public print: NgxPrintElementService
  ) { }

  tableItems: any[] =['Item No', 'Material Code', 'Description', 'HSN/SAC', 'Qty', 'Rate', 'Amount(INR)']
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


  Note!:any
  data:any = [];
  listInvoicesForReceipt() {
    this.inventorySer.listInvoices({invoiceNo: this.invoiceNumber}).subscribe((res:any)=> {
      let x = Math.round(res.grandTotal);
      res.grandTotal = x;
      this.Note = res;
      this.newNote = res.items
    })
  }

  // getTotalAmount(): number {
  //   return this.newNote.reduce((total:any, item:any) => total + (item.quantity  * item.cost) , 0);
  // }

  getCeiledGrandTotal() {
    return Math.ceil(this.Note[0]?.grandTotal || 0);
  }

  invNumber!: any;
  invDate!: any;
  public config: Config = {
    printMode: 'template',
    popupProperties: 'toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, fullscreen=yes',
    pageTitle: 'Hello World',
    // htmlType: 'text',

    templateString: `
    <div>
        <header>
          <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.2;">
              <img src="assets/icons/Mangalagiri Weavers.jpg" width="100%" alt="">
          </div>


        </header>
        
        {{printBody}}
        
        <footer></footer>
    </div>
    `,

    stylesheets: [{ rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' }],
    styles: [
      `
      header, footer{
        text-align: center;
      }
        
      .sub-heading{
        font-weight: 600;
        font-size: 16px;
      }

      tbody, td, tfoot, th, thead, tr {
        border-width: 0 1px;
        
      }

      .table>:not(caption)>*>* {
        padding: 0;
      }

      .table {
        border: 1px solid #000;
      }

      .table tbody tr td {
        padding: 0;
      }

      thead tr th {
        color: #000;
      }

      tfoot tr {
        border: 1px solid #000;
      }
      `
    ]
  }

  @ViewChild('tableRef') tableElement!: ElementRef<HTMLTableElement>;

  onPrint1(el: ElementRef<HTMLTableElement | HTMLElement>) {
    console.log(this.Note.invoiceNo);
    this.invNumber = this.Note.invoiceNo;
    this.invDate = this.Note.invoiceDate
    this.print.print(el, this.config).subscribe(console.log);
  }

}
