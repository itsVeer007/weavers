import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SiteService } from 'src/services/site.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetService } from 'src/services/asset.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  constructor(
    private siteSer: SiteService,
    private assetSer: AssetService,
    public dialog: MatDialog
  ) { }

  tableData: any = [];
  newTableData: any = [];
  showLoader: boolean = false;
  searchText: any;

  active: any;
  inActive: any = [];
  onHold: any = [];


  tempSite: any;
  // siteData: any;

  ngOnInit(): void {
    this.tempSite = JSON.parse(localStorage.getItem('temp_sites')!);
    // this.siteData = JSON.parse(localStorage.getItem('siteIds')!)?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);

    // this.tableData = this.siteData;
    // this.newTableData = this.tableData;
    this.listSites()
  }

  listSites() {
    this.showLoader = true;
    this.siteSer.listSites().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res?.Status == 'Success') {
        this.tableData = res?.siteList?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
        this.newTableData = this.tableData;
      }
      }, (err: any) => {
        this.showLoader = false;
    });
  }


  deviceData: any;
  inputToDevices: any;
  getDevices(siteId: any) {
    this.assetSer.listDeviceBySiteId(siteId).subscribe((res: any) => {
      this.deviceData = res.flatMap((item: any) => item.adsDevices);
      this.inputToDevices = this.deviceData;
      // console.log('site',this.inputToDevices);
    })
  }

  engineerDetail: any;
  onGetEngineer(id: any) {
    this.siteSer.getEngineer(id).subscribe((res: any) => {
      this.engineerDetail = res.Engineer_details;
      // console.log(this.engineerDetail);
    })
  }

  engineerId = 0;
  engineerView(e: any, i: any) {
    this.engineerId = i;
    var x = e.target.nextElementSibling;
    x.style.display == 'none' ? x.style.display = 'flex' : x.style.display = 'none';
  }

  onGetCentralboxDetail: any;
  onGetCentralbox(id: any) {
    this.siteSer.getCentralbox(id).subscribe((res: any) => {
      // console.log(res)
    })
  }

  saveSiteData(site: any) {
    localStorage.setItem('temp_sites', JSON.stringify(site));
  }

  /* searches */

  siteSearch: any;
  siteNg: any = 'All'
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  filterSites(site: any) {
    if(site != 'All') {
      this.newTableData =  this.tableData.filter((item: any) => item.siteid == site)
    } else {
      this.newTableData = this.tableData;
    }
  }

  showAddSite: boolean = false;
  showAddDevice: boolean = false;

  show(value: string) {
    if(value == 'site') {
      this.showAddSite = true
    }
    if(value == 'device') {
      this.showAddDevice = true
    }
  }

  closenow(type: string) {
    if (type == 'site') {
      this.showAddSite = false
    }
    if (type == 'device') {
      this.showAddDevice = false
      }
  }

  addressid = 0;
  addressView(e: any, i: any) {
    this.addressid = i;
    var x = e.target.nextElementSibling;
    // console.log("AddressView:: ",x)
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
    // this.address = !this.address;
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("Close-Click:: ",x);
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
  }

  masterSelected: boolean = false;
  SelectAll: boolean = false;


  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.tableData.length; i++) {
      // console.log(this.tableData[i])
      this.tableData[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.tableData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }


  currentItem: any;

  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;

  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewSiteDialog);
    // console.log(this.currentItem);
  }

  confirmViewRow() {
    // console.log(this.currentItem);
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;

  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editSiteDialog);
  }

  confirmEditRow() {
    // console.log(this.currentItem);
  }


  @ViewChild('deleteSiteDialog') deleteSiteDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteSiteDialog);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    this.tableData = this.tableData.filter((item: any) => item.siteId !== this.currentItem.siteId);
  }


  /* checkbox control */

  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewSiteDialog, this.dialog.open(this.editSiteDialog));
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
  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editSiteDialog,     this.dialog.open(this.editSiteDialog));
    }
  }

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
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        this.tableData = this.tableData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.tableData.forEach((el: any) => {
        this.tableData = this.tableData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }


  sorted = false;
  sort(label:any){
    this.sorted = !this.sorted;
    var x = this.tableData;
    if(this.sorted==false){
      x.sort((a:string, b:string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    }else{
      x.sort((a:string, b:string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}


