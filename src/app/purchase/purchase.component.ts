import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from 'src/services/inventory.service';
import { jsPDF } from 'jspdf';
import { StorageService } from 'src/services/storage.service';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { Config, NgxPrintElementService } from 'ngx-print-element';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  dialog: any;
  Math: any;
  constructor(private http:HttpClient,
    private inventorySer: InventoryService,
    private storageSer :StorageService,
    public datepipe:DatePipe,
    public print: NgxPrintElementService
  ) { }

  dcItems: any;
  purchaseNumber:any 
  ngOnInit(): void {
    this.dcItems = this.storageSer.get('dcItems');
    this.inventorySer.purchaseSub.subscribe((res:any)=> {
      this.purchaseNumber = res;
    })
    this.listInvoicesForReceipt()
  }

  @ViewChild('table', { static: false }) table!: ElementRef;
  showSaveButton: boolean = true;
  newNote: any = [];
  generatePDF() {
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
    this.inventorySer.listPOForm({purchaseRef: this.purchaseNumber}).subscribe((res:any)=> {
      this.newNote = res;
    })
  }

  getTotalAmount(): number {
    return this.data.reduce((total:any, item:any) => total + (item.quantity  * item.cost) , 0);
  }

  getCeiledGrandTotal() {
    return Math.ceil(this.newNote[0]?.grandTotal || 0);
  }

  getCeiledGrand() {
    return Math.ceil(this.newNote[0]?.sgst || 0);
  }
  getCeiledGrandTotall() {
    return Math.ceil(this.newNote[0]?.cgst || 0);
  }


  downloadPDF() {
    const htmlWidth =500;
    const htmlHeight =  500;

    const topLeftMargin = 15;

    let pdfWidth = htmlWidth + (topLeftMargin * 2);
    let pdfHeight = (pdfWidth * 1.5) + (topLeftMargin * 2);

    const canvasImageWidth = htmlWidth;
    const canvasImageHeight = htmlHeight;

    const totalPDFPages = 2;

    const data = document.getElementById('idcard_main');
    html2canvas(this.table.nativeElement, { allowTaint: true }).then(canvas => {
      canvas.getContext('2d');
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      let pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'png', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);
      
      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage([pdfWidth, pdfHeight], 'p');
        pdf.addImage(imgData, 'png', topLeftMargin, - (pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
      }

      pdf.save(`Document ${new Date().toLocaleString()}.pdf`);
    });
  }

  getPDF() {
    html2canvas(this.table.nativeElement).then((canvas) => {
      canvas.getContext('2d');
      var HTML_Width = canvas.width;
      var HTML_Height = canvas.height;
      var top_left_margin = 15;
      var PDF_Width = HTML_Width + top_left_margin * 2;
      var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
      var canvas_image_width = HTML_Width;
      var canvas_image_height = HTML_Height;

      var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      
      var imgData = canvas.toDataURL('image/jpeg', 1.0);
      const backgroundImg = 'assets/icons/Mangalagiri Weavers.jpg';
      var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);

      // pdf.addImage(backgroundImg, 'jpg', 0, 0, 500, 500);
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage([PDF_Width, PDF_Height]);
        let margin = -(PDF_Height * i) + top_left_margin * 4;
        if (i > 1) {
          margin = margin + i * 8;
        }

        // pdf.addImage(backgroundImg, 'jpg', 0, 0, 500, 500);
        pdf.addImage(imgData, 'JPG', top_left_margin, margin, canvas_image_width, canvas_image_height);
      }
      pdf.save(`Document ${new Date().toLocaleString()}.pdf`);
    });
  }

  public config: Config = {
    printMode: 'template',
    popupProperties: 'toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, fullscreen=yes',
    pageTitle: 'Hello World',
    // htmlType: 'text',

    templateString: `<header>I\'m part of the template header</header>{{printBody}}<footer>I\'m part of the template footer</footer>`,
    
    stylesheets: [{ rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' }],
    styles: [
      'header, footer{ text-align: center; }',
      'body .bg-success{ background-color: #4dcf83 !important; }',
      'body .bg-danger{ background-color: #f96868 !important; }',
    ]
  }

  @ViewChild('tableRef') tableElement!: ElementRef<HTMLTableElement>;
  onPrint1(el: ElementRef<HTMLTableElement | HTMLElement>) {
    this.print.print(el, this.config).subscribe(console.log);
  }

}
