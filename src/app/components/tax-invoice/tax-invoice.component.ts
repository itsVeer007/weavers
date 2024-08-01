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
  @Input() inNumber: any;

  dialog: any;
Math: any;
  constructor(private http:HttpClient,
    private inventorySer: InventoryService,
    private storageSer :StorageService,
    public datepipe:DatePipe,
    public print: NgxPrintElementService
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

  public config: Config = {
    printMode: 'template',
    popupProperties: 'toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, fullscreen=yes',
    pageTitle: 'Hello World',
    // htmlType: 'text',

    templateString: `
    <header>
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.2;">
          <img src="assets/icons/Mangalagiri Weavers.jpg" width="100%" alt="">
      </div>

      <div class="d-flex justify-content-between align-items-center" style="border-bottom: 1px solid;">
              <img src="assets/icons/Mangalagiri Weavers Development Logo_2.jpg" alt="" width="80px">
              <span class="heading">TAX INVOICE</span>

          <div style="border-left: 1px solid; height: 80px;" class="p-3">
              <p class="secondHeading">Inv No:&nbsp; ${this.newNote[0]?.invoiceNo }</p>
              <p class="secondHeading">Inv Date:&nbsp; ${this.newNote[0]?.invoiceDate}</p>
          </div>
      </div>
    </header>
    
    {{printBody}}
    <footer>
        <div>
            <div class="d-flex justify-content-between" style="border: 1px solid #000;">
                <div style="border-right: 1px solid #000;">
                    <div style="border-bottom: 1px solid #000; width: 550px;">
                        <p class="secondHeading">Total Amount in Word:{{getCeiledGrandTotal()| numberToWords}}</p>
                        <p style="font-size: 12px;"> </p>
                    </div>
                    <div>
                        <p class="secondHeading">Bank Details : ICICI Bank</p>
                        <p class="secondHeading"> Account No: 384605500353</p>
                        <p class="secondHeading"> IFSC Code : ICIC0003846</p>
                    </div>
                </div>
                <div class="d-flex flex-column align-items-end" style="padding-left: 10px;">
                    <p class="text-center" style="font-size: 11px; font-weight: bold;">For Mangalagiri Handloom Development Center</p>
                    <p class="secondHeading mt-5">Authorised Signatory</p>
                </div>
            </div>
        </div>
    </footer>`,

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
      `
    ]
  }

  @ViewChild('tableRef') tableElement!: ElementRef<HTMLTableElement>;
  onPrint1(el: ElementRef<HTMLTableElement | HTMLElement>) {
    this.print.print(el, this.config).subscribe(console.log);
  }

}
