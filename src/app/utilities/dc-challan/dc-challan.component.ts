import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-dc-challan',
  templateUrl: './dc-challan.component.html',
  styleUrls: ['./dc-challan.component.css']
})
export class DcChallanComponent implements OnInit {

  constructor() { }

  dcItems: any;
  ngOnInit(): void {
    this.dcItems = JSON.parse(localStorage.getItem('dcItems')!);
    console.log(this.dcItems);
  }

  @ViewChild('table', { static: false }) table!: ElementRef;

  generatePDF() {
    const doc = new jsPDF();
    const table = this.table.nativeElement;

    // Use html2canvas to capture the table as an image
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);

      // Save the PDF
      doc.save('table-data.pdf');
    });
  }

}
