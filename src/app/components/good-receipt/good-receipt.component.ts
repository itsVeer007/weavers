import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InventoryService } from 'src/services/inventory.service';

@Component({
  selector: 'app-good-receipt',
  templateUrl: './good-receipt.component.html',
  styleUrls: ['./good-receipt.component.css']
})
export class GoodReceiptComponent implements OnInit {

  @Input() note: any;

  constructor(
    private inventorySer: InventoryService
  ) { }

  ngOnInit(): void {
    // this.listGoodReceiptNote()
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

  // note:any = [];
  listGoodReceiptNote() {
    this.inventorySer.listGoodReceiptNote().subscribe((res:any)=> {
      // console.log(res)
      this.note = res;
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
}


