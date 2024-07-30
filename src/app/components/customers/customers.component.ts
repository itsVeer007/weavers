import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
  //   var y = <HTMLElement>document.getElementById(`icons-site`);

  //   // console.log(`plus-img${this.currentid}`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       if (x.style.display == 'flex' || x.style.display == 'block') {
  //         x.style.display = 'none';
  //       }
  //     }
  //   }

  //   if (y != null) {
  //     console.log(`icons-site`);
  //     if (!y.contains(e.target)) {
  //       this.icons1 = false;
  //     }
  //   }
  // }




  showLoader = false;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.CustomerReport();
  }

  // showIconVertical: boolean = false;
  // showIconCustomer: boolean = false;
  // showIconSite: boolean = false;
  // showIconCamera: boolean = false;
  // showIconAnalytic: boolean = false;
  // showIconUser: boolean = false;


  searchText: any;
  CustomerTable: any;
  CustomerReport() {
    this.http.get('assets/JSON/customerData.json').subscribe(res => {
      // console.log("CustomerReport::",res);
      this.CustomerTable = res;
    });
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("THREE DOTS:: ",e.target.parentNode.nextElementSibling);
    if (x.style.display == 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  // showAddSite = false;
  // showAddCamera = false;
  // showAddUser = false;
  // showAddBusinessVertical = false;
  // closenow(value:any) {
  //   this.showAddSite = value;
  // }

  showAddCustomer = false;

  closenow(value: any, type: String) {
    if (type == 'cust') { this.showAddCustomer = value; }

    // if (type == 'site') { this.showAddSite = value; }
    // if (type == 'camr') { this.showAddCamera = value; }
    // if (type == 'vert') { this.showAddBusinessVertical = value; }
    // if (type == 'user') { this.showAddUser = value; }
    // console.log("SITES:: ",type)

    // setTimeout(() => {
    //   var openform = localStorage.getItem('opennewform');
    //   if (openform == 'showAddSite') { this.showAddSite = true; }
    //   if (openform == 'showAddCamera') { this.showAddCamera = true; }
    //   if (openform == 'showAddCustomer') { this.showAddCustomer = true; }
    //   if (openform == 'showAddBusinessVertical') { this.showAddBusinessVertical = true; }
    //   if (openform == 'showAddUser') { this.showAddUser = true; }
    //   localStorage.setItem('opennewform', '');
    // }, 100)
  }

  // showAddCamera = false;

  // closenow1(value:any) {
  //   this.showAddCamera = value;
  // }

  // showAddCustomer = false;

  // closenow2(value:any) {
  //   this.showAddCustomer = value;
  // }

  // showAddUser = false;

  // closenow3(value:any) {
  //   this.showAddUser = value;
  // }

  // showAddBusinessVertical = false;

  // closenow4(value:any) {
  //   this.showAddBusinessVertical = value;
  // }

  show(type: string) {
    if (type == 'cust') { this.showAddCustomer = true; }

    // this.icons1 = !this.icons1;
    // this.showIconVertical = false;
    // this.showIconCustomer = false;
    // this.showIconSite = false;
    // this.showIconCamera = false;
    // this.showIconAnalytic = false;
    // this.showIconUser = false;
  }

  masterSelected: boolean = false;

  // allchecked(e:any){
  //   if(document.querySelector('#allchecked:checked')){
  //     this.masterSelected = true;
  //   }else {
  //     this.masterSelected = false;
  //   }
  // }

  // -----------------Start Checkbox-----------------
  selectedAll: any;

  selectAll() {
    for (var i = 0; i < this.CustomerTable.length; i++) {
      // console.log(this.CustomerTable[i])
      this.CustomerTable[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.CustomerTable.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }
  // -------------------End Checkbox----------------------

  // ---------------- Start delete ---------------------
  deleteRow: any;

  deleteRow1(item: any, i: any) {
    // console.log(item);
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.CustomerTable.splice(i, 1);
    }, 1000);
  }

  deletePopup: boolean = true;
  confirmDeleteRow() {
    // console.log(this.currentItem);
    this.CustomerTable = this.CustomerTable.filter((item: any) => item.siteId !== this.currentItem.siteId);
    this.deletePopup = true;
  }

  closeDeletePopup() {
    this.deletePopup = true;
  }

  currentItem: any;
  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    // console.log("Selected Item:: ", item);
    this.deletePopup = false;
    // console.log("Open Delete Popup:: ",this.deletePopup);
    // console.log(this.CustomerTable.siteId);
  }

  // ------- End delete ----------------



  // -------Start Edit -------------
  editPopup: boolean = true;

  confirmEditRow() {
    // console.log(this.currentItem);
    // this.CustomerTable= this.CustomerTable.filter((item:any) => item.siteId !== this.currentItem.siteId);
    this.editPopup = true;
    this.CustomerReport();
  }

  closeEditPopup() {
    this.editPopup = true;
  }

  openEditPopup(item: any, i: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    // this.currentItem = item;
    // console.log("Selected Item:: ", item);
    this.editPopup = false;
    // console.log("Open Delete Popup:: ",this.editPopup);
    // console.log(this.CustomerTable.siteId);
  }

  editArray: any = [];
  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("Edit By Checkbox:: ",itemE);
    // console.log("Edit Array::" ,this.editArray);
    // console.log("present in array : "+this.editArray.includes(itemE),  " checked : "+ checked)
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
      this.editPopup = false;
    }
    this.CustomerReport();
  }
  // -------------- End Edit ------------------




  // ------------- start View --------------------

  viewPopup: boolean = true;

  confirmViewRow() {
    // console.log(this.currentItem);
    this.viewPopup = true;
  }

  closeViewPopup() {
    this.viewPopup = true;
  }

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    // console.log(this.currentItem);
    this.viewPopup = false;
  }

  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("View By Checkbox:: ",itemV);
    // console.log("View Array::" ,this.viewArray);
    // console.log("present in array : "+this.viewArray.includes(itemV),  " checked : "+ checked)
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.viewPopup = false;
    }
  }
  // ------------- End View ---------------------



  // ------------ Multiple Records Starts -------------------
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
        this.CustomerTable = this.CustomerTable.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.CustomerTable.forEach((el: any) => {
        this.CustomerTable = this.CustomerTable.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

  // ------------ Multiple Records Ends -------------------

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.CustomerTable;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
