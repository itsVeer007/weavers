import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.css']
})
export class MetaDataComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    var y = <HTMLElement>document.getElementById(`icons-site`);

    // console.log(`plus-img${this.currentid}`);
    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    // if (y != null) {
    //   console.log(`icons-site`);
    //   if (!y.contains(e.target)) {
    //     this.icons1 = false;
    //   }
    // }
  }




  showLoader = false;
  constructor(
    private http: HttpClient,
    private metaDataSer: MetadataService,

    public dialog: MatDialog,
    public alertSer: AlertService
  ) { }

  ngOnInit(): void {
    this.CustomerReport();
  }

  showIconVertical: boolean = false;
  showIconCustomer: boolean = false;
  showIconSite: boolean = false;
  showIconCamera: boolean = false;
  showIconAnalytic: boolean = false;
  showIconUser: boolean = false;



  searchText: any;
  metaData: any = []
  newMetaData: any = [];
  typeToTable: any
  CustomerReport() {
    this.showLoader = true;
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      this.showLoader = false;
      this.metaData = res;
      this.typeToTable = res.flatMap((item: any) => item.type);
    })
  }

  deviceSearch: any;
  searchDevices(e: any) {
    this.deviceSearch = (e.target as HTMLInputElement).value;
  }

  metaType: any = 'All';
  filterDevices(data: any) {
    this.metaDataSer.getMetadataByType(data).subscribe((res: any) => {
      this.newMetaData = res;
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

  showTicket: boolean = false;
  show(type: string, val: any) {
    if(val != 'All') {
      if (type == 'ticket') {
        this.showTicket = true
      }
      localStorage.setItem('metaType', val)
    } else {
      this.alertSer.error('Please select type')
    }
  }

  closenow(type: String) {
    if (type == 'ticket') {
      this.showTicket = false;
    }
  }


  currentItem: any;

  @ViewChild('viewDataDialog') viewDataDialog = {} as TemplateRef<any>;

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    this.dialog.open(this.viewDataDialog);
    // console.log(this.currentItem);
  }


  @ViewChild('editDataDialog') editDataDialog = {} as TemplateRef<any>;

  typeFromLocal: any;
  openEditPopup(item: any, type: any) {
    localStorage.setItem('metaType', type);
    this.typeFromLocal = localStorage.getItem('metaType');

    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editDataDialog);
    // console.log(item);
  }

  confirmEditRow() {
    let myObj = {
      "keyId": this.currentItem.keyId,
      "type": this.typeFromLocal,
      "value": this.currentItem.value,
      "modifiedBy": 1,
      "remarks": this.currentItem.remarks
    }
    this.metaDataSer.updateMetadataKeyValue(myObj).subscribe((res: any) => {
      // console.log(res);
        this.alertSer.success(res?.message);
        this.CustomerReport();
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    })
  }


  @ViewChild('deleteDataDialog') deleteDataDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteDataDialog);
  }


  deleteRow1(item: any, i: any) {
    // console.log(item);
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.newMetaData.splice(i, 1);
    }, 1000);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    this.newMetaData = this.newMetaData.filter((item: any) => item.siteId !== this.currentItem.siteId);
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newMetaData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  /* checkbox control */

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.newMetaData.length; i++) {
      // console.log(this.metaData[i])
      this.newMetaData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.newMetaData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }

  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewDataDialog);
    }
  }

  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }


  editArray: any = [];
  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }

  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editDataDialog);
    }
    this.CustomerReport();
  }


  deletearray: any = [];
  deleteMultiRecords(item: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("Delete Multiple Records:: ", item);
    if (this.deletearray.length == 0) { this.deletearray.push(item) }

    this.deletearray.forEach((el: any) => {
      if (el.siteId != item.siteId && checked) {
        this.deletearray.push(item);
        this.deletearray = [...new Set(this.deletearray.map((item: any) => item))]
      }
      if (el.siteId == item.siteId && !checked) {
        var currentindex = this.deletearray.indexOf(item);
        this.deletearray.splice(currentindex, 1)
      }
    });
    // console.log(this.deletearray)
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        // this.currentItem = el;
        // this.confirmDeleteRow();
        this.newMetaData = this.newMetaData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.newMetaData.forEach((el: any) => {
        this.newMetaData = this.newMetaData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

}
