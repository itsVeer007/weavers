import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Config, NgxPrintElementService } from 'ngx-print-element';
import { InventoryService } from 'src/services/inventory.service';

@Component({
  selector: 'app-good-receipt',
  templateUrl: './good-receipt.component.html',
  styleUrls: ['./good-receipt.component.css']
})
export class GoodReceiptComponent implements OnInit {

  // @Input() goodRecieptData: any;

  constructor(
    private inventorySer: InventoryService,
    public print: NgxPrintElementService
  ) { }

  tableItems: any[] =['Item Code', 'Description', 'Qty', 'Unit price', 'Uom', 'Amount(INR)']

  invoiceNumber: any;
  ngOnInit(): void {
    this.inventorySer.goodRecieptSub.subscribe({
      next: (res) => {
        this.invoiceNumber = res;
      }
    })
    this.listGoodReceiptNote()
  }

  @ViewChild('table', { static: false }) table!: ElementRef;
  showSaveButton: boolean = true;

  generatePDF() {
    const buttons = document.getElementById('buttons');
    if (buttons) {
      buttons.classList.add('hidden-for-pdf');
    }

    const doc = new jsPDF();
    const table = this.table.nativeElement;
    // Use html2canvas to capture the table as an image
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', 30, 10, 150, 0);
      // Save the PDF
      doc.save('table-data.pdf');
      if (buttons) {
        buttons.classList.remove('hidden-for-pdf');
      }
    });
  }

  newnote:any = [];
  note:any = [];
  listGoodReceiptNote() {
    this.inventorySer.listGoodReceiptNote(this.invoiceNumber).subscribe((res:any)=> {
      // console.log(res)
      this.note = res;
      this.newnote = res;
    })
  }

  // getTotalAmount(): number {
  //   return this.note.reduce((total:any, item:any) => Math.ceil(total + (item.quantity  * item.cost)) , 0);
  // }
  getTotalAmount(): number {
    return this.note.reduce((total: number, item: any) => {
      const itemTotal = Math.ceil(item.quantity * item.cost);
  
      // Add SGST and CGST if they are present
      const sgst = item.sgst ? item.sgst : 0;
      const cgst = item.cgst ? item.cgst : 0;
  
      // Add IGST if it is present, otherwise add SGST and CGST
      const igst = item.igst ? item.igst : 0;
  
      return total + itemTotal + sgst + cgst + igst;
    }, 0);
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
    </header>
      <div style="border: 1px solid #000;">
        {{printBody}}
      </div>
    <footer>
      <div>
          <hr class="line">
          <p class=" secondHeading text-center">Mangalagiri Handlooms Development Center</p>
          <p class="text-center my-2 heading">Regd.Off:Flat No.508,Kosanam,Roy Heights,APNRT Tech Park,Mangalagiri,Guntur District-522503,Andhra Pradesh</p>
          <p class="text-center heading"><span>Mfg. Address:</span>S.No.49,p.No.133,Autonagar,Mangalagiri,Guntur District-522503,Andhra Pradesh</p>
      </div>
    </footer>`,

    stylesheets: [{ rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' }],
    styles: [`
      .sub-heading{
        font-weight: 600;
        font-size: 16px;
      }

      .address-container{
        border-radius: 1px;
        border-width: 1px;
        color: rgb(19, 20, 20);
        border-style: solid;
        padding: 2px;
      }

      .secondHeading {
        font-weight: bold;
        font-size:16px;
        color: black;
      }
      `
    ]
  }

  @ViewChild('tableRef') tableElement!: ElementRef<HTMLTableElement>;
  onPrint1(el: ElementRef<HTMLTableElement | HTMLElement>) {
    this.print.print(el, this.config).subscribe(console.log);
  }

}


