import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-fr',
  templateUrl: './fr.component.html',
  styleUrls: ['./fr.component.css']
})
export class FrComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private InventoryService:InventoryService
  ) { }

  showLoader: boolean = false;
  siteIds: any;
  searchText: any;
  user: any;

  
    
  showFrkit: boolean = false;
  showing(type: string) {
    if (type == 'frKit') {
      this.showFrkit = true;
    }
    // if(type == 'add') {
    //   this.cart = true;
    // }
  }

  closenoww(type: String) {
    if (type == 'frKit') {
      this.showFrkit = false;
    }
  }
  ngOnInit(): void {
    this.siteIds = JSON.parse(localStorage.getItem('siteIds')!)?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
    this.user =   JSON.parse(localStorage.getItem('user')!);
    // this.listFRSites();
    // this.listFRTickets();
    this.listClientRequestDetails();
  }

  clientData:any;
  listClientRequestDetails() {
    this.InventoryService.listClientRequestDetails().subscribe((res)=> {
      console.log(res);
      this.clientData = res;
      this.getMetadata();
    })
  }

  final:any;
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  open(item:any) {
    console.log(item)
    this.inventorySer.listClientRequests(item).subscribe((res: any) => {
      console.log(res);
      this.final = res;
    })
    // this.dialog.open(this.usedItemsDialog);
  }


  statusItems: any;
  @ViewChild('viewSitesDialog') viewSitesDialog = {} as TemplateRef<any>;
  openStatusItems(item:any) {
  console.log(item)
    this.inventorySer.listInventoryForSending(item).subscribe((res: any) => {
      console.log(res);
      this.statusItems = res;
    })
    this.dialog.open(this.viewSitesDialog);
  }

  assignedObj = {
    statusId: null,
    id: null,
    modifiedBy:null
  }

  updateInventoryStatusForFGSending() {
    this.assignedObj.modifiedBy = this.user?.UserId
    this.inventorySer.updateInventoryStatusForFGSending(this.assignedObj).subscribe((res:any)=> {
      // console.log();
      this.alertSer.snackSuccess(res?.message);
    })
  }


  frTickets: any = [];
  newFrTickets: any = [];
  errInfo: any = null;
  listFRTickets() {
    this.showLoader = true;
    this.inventorySer.listFRTickets(this.user?.UserId).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;

      this.frTickets = res;
      this.newFrTickets = this.frTickets;
      if(this.frTickets?.length == 0) {
        this.errInfo = 'No tickets'
      }
    }, (err: any) => {
      // console.log(err);
      this.showLoader = false;
      if(err?.status == 0) {
        this.errInfo = 'Connection timed out';
      } else {
        this.errInfo = err?.message;
      }
    })
  }

  Weavers_Inventory_Status: any;
  uomItem: any;
  quality:any;
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    data?.forEach((item: any) => {
      if(item.type === 48) {
        this.Weavers_Inventory_Status= item.metadata;
        console.log(this.Weavers_Inventory_Status)
      }
    })
  }

  siteNg: any;
  filterSites(site: any) {
    if(site == 'All') {
      this.newFrTickets = this.frTickets;
    } else {
      this.newFrTickets =  this.frTickets.filter((item: any) => item.sitename == site);
    }
  }

  showIndent:boolean = false;
  showDcFr: boolean = false;
  // show(type:string) {
  //   if(type =='showIndent') {
  //     this.showIndent = true
  //   }
  // }

  crdId:any;

  show(type: string,value:any) {
    this.crdId = value;
    if (type == 'showDcFr') {
      this.showDcFr = true
    } else if(type =='showIndent') {
          this.showIndent = true
        }
  }
  closenow(type: String) {
      if (type == 'showDcFr') {
        this.showDcFr = false
        } else if(type =='showIndent') {
          this.showIndent = false
        }
  }

  ticketIdToFr(ticketId: any) {
    localStorage.setItem('ticketId', JSON.stringify(ticketId));
  }



  latestFun(type: any, status: any) {
    this.inventorySer.listFRItems(type, status).subscribe((res: any) => {
      this.statusItems = res;
    })
  }

  @ViewChild('ticketTaskDialog') ticketTaskDialog = {} as TemplateRef<any>;
  ticketTasks: any;
  ticketVisits: any;
  ticketComments: any = [];
  openTicketTaskDialog(item: any) {
    this.dialog.open(this.ticketTaskDialog);
    this.inventorySer.getTasks(item.ticketId).subscribe((tasks: any) => {
      this.ticketTasks = tasks;
    });
  }

  // @ViewChild('viewSitesDialog') viewSitesDialog = {} as TemplateRef<any>;
  sites: any
  openSitesDialog() {
    // this.dialog.open(this.viewSitesDialog);

    this.inventorySer.listFRSites(this.user?.UserId).subscribe((res: any) => {
      // console.log(res);
      this.sites = res;
    })
  }


  fieldVisitEntry(item: any) {
    this.inventorySer.fieldVisitEntry(item).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success('Entry Successful');
    }, (err: any) => {
      this.alertSer.error(err?.error?.message);
    })
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.frTickets;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sortIndentViewIndent(label: any) {
    this.sorted = !this.sorted;
    var y = this.indentItems;
    if (this.sorted == false) {
      y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sortCurrentTasks(label: any) {
    this.sorted = !this.sorted;
    var y = this.tasks;
    if (this.sorted == false) {
      y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  @ViewChild('currentTasksDialog') currentTasksDialog = {} as TemplateRef<any>;
  tasks: any = [];
  ticketType: any;
  currentSite: any;
  openTasksDialog(data: any) {
    // console.log(data);
    this.ticketType = data?.typeId;
    this.currentSite = data?.siteId;
    this.currentTicketId = data;
    this.dialog.open(this.currentTasksDialog);
    // this.inventorySer.listFRTasksOfCurrentVisit(this.user?.UserId, this.currentSite).subscribe((res: any) => {
    //   this.tasks = res;
    // })
    if(data.ticketType == "Maintenance") {
      this.inventorySer.listFRTasksOfCurrentVisit(this.user?.UserId, this.currentSite).subscribe((res: any) => {
        this.tasks = res.filter((item: any) => item.type == "Maintenance");
      })
    } else if(data.ticketType == "Installation") {
      this.inventorySer.listFRTasksOfCurrentVisit(this.user?.UserId, this.currentSite).subscribe((res: any) => {
        this.tasks = res.filter((item: any) => item.type == "Installation");
      })
    }
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;
  currentTask: any;
  openTaskStatus(item: any) {
    this.currentTask = item;
    // this.dialog.open(this.assignedDialog);
  }


  @ViewChild('viewIndentDialog') viewIndentDialog = {} as TemplateRef<any>;
  indentItems: any = [];
  currentTicketId: any;
  openDetailsDialog(item: any) {
    // console.log(item);
    this.dialog.open(this.viewIndentDialog);
    this.inventorySer.listIndentItems(item).subscribe((res: any) => {
      // console.log(res);
      this.indentItems = res;
    })
  }

  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;
  currentId: any = null;
  openEditStatus(id: any) {
    this.dialog.open(this.editStatus);
    this.currentId = id;
    // console.log(id);
  }

  statusObj = {
    // id: this.currentId,
    statusId: null,
    createdBy: null
  }

  updateInventoryStatus() {
    // this.alertSer.wait();
    this.statusObj.createdBy = this.user?.UserId;
    this.inventorySer.updateIndentStatus1(this.currentId, this.statusObj).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  @ViewChild('replaceDialog') replaceDialog = {} as TemplateRef<any>;
  openCreateOrder(item: any) {
    // console.log(item)
    this.dialog.open(this.replaceDialog);
    this.inventorySer.listIndentItems(item).subscribe((res: any) => {
      this.indentItems = res;
    })
  }

  centralboxBody = {
    centralBoxId: null,
    inventoryId: null,
    createdBy: null
  }

  addComponent() {
    this.centralboxBody.createdBy = this.user?.UserId;
    this.inventorySer.addComponent(this.centralboxBody).subscribe((res: any) => {
      // console.log(res)
    })
  }

  @ViewChild('replaceStatusDialog') replaceStatusDialog = {} as TemplateRef<any>;
  inventoryId: any;
  duplicateInventoryId: any;
  inventoryId2: any;
  openReplaceComponent(data: any) {
    this.body.oldInventoryId = null;
    this.body.newInventoryId = null;
    this.dialog.open(this.replaceStatusDialog);
    this.inventorySer.getItemsList(data).subscribe((res: any) => {
      // console.log(res);
      this.inventoryId = res;

      this.duplicateInventoryId = this.inventoryId.reduce((acc: any, current: any) => {
        const x = acc.find((item: any) => item.inventorySlNo == current.inventorySlNo);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
    });

    this.inventorySer.listIndentItems(data).subscribe((res: any) => {
      // console.log(res);
      this.inventoryId2 = res;
    })
  }

  body = {
    oldInventoryId: null,
    newInventoryId: null,
    replacedBy: null
  }

  body1 = {
    // oldInventoryId: null,
    newInventoryId: null,
    replacedBy: null,
    siteId: null
  }

  replaceComponent() {
    this.body.replacedBy = this.user?.UserId
    this.inventorySer.replaceComponent(this.body).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  changeToInstall(data: any) {
    this.body1.siteId = this.currentSite;
    this.body1.replacedBy = this.user?.UserId
    this.body1.newInventoryId = data?.inventoryId;
    this.inventorySer.replaceComponent(this.body1).subscribe((res: any) => {
      // console.log(res);
      if(res?.statusCode == 200) {
        this.alertSer.success(res?.message);
        this.inventorySer.listIndentItems(this.currentTicketId).subscribe((finalRes: any) => {
          this.indentItems = finalRes;
        })
      }
    }, (err: any) => {
      this.alertSer.error('Out of stock')
    })
  }

  @ViewChild('cnfrmStatusDialog') cnfrmStatusDialog = {} as TemplateRef<any>;
  currentStatusItem: any;
  currentStatusType: any;
  openCnfrmStatusDialogt(item: any, type: any) {
    this.currentStatusItem = item;
    this.currentStatusType = type
    this.dialog.open(this.cnfrmStatusDialog);
  }

  logTaskStatus(item: any, status: any) {
    let myObj = {
      'taskId': item.id,
      'statusId': status,
      'fieldVisitId': item.fieldVisitId,
      'changedBy': this.user?.UserId,
      'remarks': '',
    }

    this.inventorySer.logTaskStatus(myObj).subscribe((res: any) => {
      this.alertSer.success(res?.message);
      // this.inventorySer.listFRTasksOfCurrentVisit(user?.UserId).subscribe((res: any) => {
      //   this.tasks = res;
      // })
    }, (err: any) => {
      this.alertSer.error(err?.error?.message);
    })
  }

  fieldExitBody = {
    frId: null,
    travelAllowance: null,
    foodAllowance: null,
    otherAllowance: null,
    remarks: null
  }

  @ViewChild('exitDialog') exitDialog = {} as TemplateRef<any>;
  openVisitExit() {
    this.dialog.open(this.exitDialog);
  }

  fieldVisitExit() {
    this.fieldExitBody.frId = this.user.UserId;
    this.inventorySer.fieldVisitExit(this.fieldExitBody).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success(res?.message);
    })
  }

  latestValue: any = [];
  removeDuplicatesAndCalculateQuantities() {
    const itemMap = new Map();
    for (const item of this.statusItems) {
      const key = item.itemCode;
      if (itemMap.has(key)) {
        itemMap.get(key).invNo += item.invNo;
        itemMap.get(key).count += 1;
      } else {
        itemMap.set(key, { ...item, count: 1 });
      }
    }
    this.latestValue = Array.from(itemMap.values());
  }

  currentItem:any;
  cost:any;
  @ViewChild ('dcChallan') dcChallan = {} as TemplateRef<any>;
  updateDispatchToInventory() {
    this.dialog.open(this.dcChallan);
    let obj = {
      oldSlNo: this.arr,
      dcNumber: this.cost
    }

    this.inventorySer.updateDispatchToInventory(obj).subscribe((res:any)=>{
      // console.log(res);
        this.alertSer.success(res?.message);
    }),(err: any) => {
        this.alertSer.error(err?.error?.message);
    }
  }

  descriptionGoods:any;
  @ViewChild('dcDescriptionDialog') dcDescriptionDialog = {} as TemplateRef<any>
  listDescriptionOfGoodsByDcNumber(item:any) {
    this.dialog.open(this.dcDescriptionDialog);
    this.inventorySer.listDescriptionOfGoodsByDcNumber(item).subscribe((res:any)=>{
      // console.log(res);
      this.descriptionGoods = res;
    })
  }

  filterBody = {
    createdBy: null
  }

  filterBody1 = {
    dateOfChallan: null
  }

  @ViewChild('dcItemsDialog') dcItemsDialog = {} as TemplateRef<any>;
  duplicateDc: any;
  newDuplicateDc: any;
  getlistByCreatedBy(type: string) {
    if(type == 'list') {
      this.filterBody.createdBy = this.user?.UserId;
      this.dialog.open(this.dcItemsDialog);
    }
    this.inventorySer.getlistByCreatedBy(type == 'list' ? this.filterBody : this.filterBody1).subscribe((res:any) => {
      // console.log(res);
      this.duplicateDc = res;
      this.newDuplicateDc = this.duplicateDc;
      this.newDuplicateDc = this.duplicateDc?.reduce((acc: any, current: any) => {
        const x = acc.find((item: any) => item.dcNumber == current.dcNumber);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
    })
  }

  // @ViewChild('dcStatusDialog') dcStatusDialog = {} as TemplateRef<any>;

  // dc: any;
  // openViewDc(data:any) {
  //   this.inventorySer.listDescriptionOfGoodsByDcNumber(data).subscribe((res:any)=>{
  //     // console.log(res);
  //     this.dc = res;
  //   })
  // }

  // listDescriptionOfGoodsByDcNumber(data:any) {
  //   this.inventorySer.listDescriptionOfGoodsByDcNumber(datas).subscribe((res:any)=>{
  //     console.log(res);
  //   })
  // }

  updateDcBody = {
    receiptNo: null,
    amount: null,
    dcNumber: null,
    modifiedBy: null
  }

  @ViewChild('dcUpdateDialog') dcUpdateDialog = {} as TemplateRef<any>
  openDcUpdateDialog(item:any){
    // this.updateDcBody.receiptNo = null;
    // this.updateDcBody.amount = null;
    this.currentItem= item;
    this.dialog.open(this.dcUpdateDialog);
  }

  updateDC(){
    this.updateDcBody.dcNumber = this.currentItem.dcNumber;
    this.updateDcBody.modifiedBy = this.user?.UserId;
    this.inventorySer.updateDC(this.updateDcBody).subscribe((res:any)=>{
      // console.log(res);
    })
  }


  selectedAll: any;
  arr: any = [];
  selectAll() {
    for (var i = 0; i < this.latestValue.length; i++) {
      this.latestValue[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected(current: any, e: any) {
    let x = e?.srcElement?.checked;
    if(x == true) {
      this.arr.push(current?.invNo)
      // console.log(this.arr);
    } else {
      this.arr.splice(this.arr.indexOf(current), 1);
      // console.log(this.arr);
    }

    this.selectedAll = this.latestValue.every(function (item: any) {
      return item.selected == true;
    })
  }

}
