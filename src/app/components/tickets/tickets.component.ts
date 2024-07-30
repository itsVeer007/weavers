import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private alertSer: AlertService,
    private storageSer: StorageService
  ) { }

  siteData: any;
  user: any;
  notFr = false;
  ngOnInit(): void {
    this.siteData = JSON.parse(localStorage.getItem('siteIds')!);
    this.user =   JSON.parse(localStorage.getItem('user')!);
    for(let item of this.user?.role) {
      if(item == 'Administrator' || item == 'Support') {
        this.notFr = true;
      }
    }
    this.listItemRequests();

    // this.inventorySer.comment$.subscribe((comments: any) => {
    //   this.ticketComments = comments;
    // });

  }

  // fileName= 'ExcelSheet.xlsx';

  // exportexcel(): void {
  //     let element = document.getElementById('excel-table');
  //     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //     XLSX.writeFile(wb, this.fileName);
  // }

  searchText: any;
  ticketData: any = [];
  newTicketData: any = [];

  ticketOpen: any = [];
  ticketClose: any = [];
  ticketProgress: any = [];
  ticketRejected: any = [];
  errMsg: any = null;
  listTickets() {
    this.showLoader = true;
    this.inventorySer.listTickets().subscribe((res: any) => {
      this.showLoader = false;
      this.getMetadata();
      this.ticketData = res;
      // this.inventorySer.mainTicketData = res;
      this.newTicketData = this.ticketData?.sort((a: any, b: any) => a?.ticketId < b?.ticketId ? 1 : a?.ticketId > b?.ticketId ? -1 : 0);
      if(this.ticketData?.length == 0) {
        this.errMsg = 'No tickets';
      } else {
        this.errMsg = null;
      }
      for(let item of this.ticketData) {
        if(item.ticketStatus == 'Open') {
          this.ticketOpen.push(item)
        } else if(item.ticketStatus == 'In Progress') {
          this.ticketProgress.push(item)
        } else if(item.ticketStatus == 'Closed') {
          this.ticketClose.push(item)
        }
        // else if(item.ticketStatus == 'Rejected') {
        //   this.ticketRejected.push(item)
        // }
      }
    }, (err: any) => {
      // console.log(err);
      this.showLoader = false;
      if(err?.status == 0) {
        this.errMsg = 'Connection timed out';
      } else if(err.error) {
        this.errMsg = err?.message;
      } else {
        this.errMsg = null;
      }
    })
  }

  listItemRequestsData:any
  listItemRequests() {
    this.inventorySer.listItemRequests().subscribe((res: any) => {
      console.log(res);
      this.getMetadata();
      this.listItemRequestsData = res;
    });
  }
  usedItems: any = [];
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  listIndentItems(data: any) {
    // console.log(data)
    this.dialog.open(this.usedItemsDialog);

    this.inventorySer.listIndentItems1(data).subscribe((res: any) => {
      // console.log(res);
      this.usedItems = res;
    })
  }

  putObj = {
    id:null,
    inventoryId:null,
    updatedBy:1608,
    statusId:null




  }

  updateItemRequestStatus() {
    this.putObj.id = this.currentTableItem.id
    this.inventorySer.updateItemRequestStatus(this.putObj).subscribe((res:any)=> {
      console.log(res);
    })
  }

  filteredSites: any;
  filterSites() {
    // this.siteData?.forEach((item: any) => {
    //   if(!this.filteredSites.includes(item?.siteid, item.sitename)) {
    //     this.filteredSites.push(item?.siteid, item.sitename);
    //       console.log(this.filteredSites)
    //   }
    // })

    this.filteredSites = this.siteData.filter((obj: any, index: any, self: any) =>
      index === self.findIndex((o: any) => {
        return o.siteid === obj.siteid;
      })
    );
  }

  // statusObj = {
  //   itemCode:null,
  //   colorCode:null,
  //   color:null,
  //   quality:null
  // }

  currentTableItem:any
  listInventoryByItemCodeData:any;
  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;
  listInventoryByItemCode(data:any) {
    this.currentTableItem = data;
    this.dialog.open(this.editStatusDialog);
    this.inventorySer.listInventoryByItemCode(data).subscribe((res:any)=> {
      console.log(res);
      this.listInventoryByItemCodeData=res;
    })
  }

  itemData:any;

  priorityVal: any;
  statusVal: any;
  assignedTo: any;
  ticketType: any;
  sourceOfRequest: any;
  ticketPriority: any;
  ticketCategory: any;
  ticketSubCategory: any;
  taskReason: any;
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    for(let item of data) {
      if(item.type == 71) {
        this.statusVal = item.metadata;
      } else if(item.type == "Ticket_Priority") {
        this.priorityVal = item.metadata;
      } else if(item.type == "Assigned_To") {
        this.assignedTo = item.metadata;
      } else if(item.type == "Ticket_Type") {
        this.ticketType = item.metadata;
      } else if(item.type == "Source_of_Request") {
        this.sourceOfRequest = item.metadata;
      } else if(item.type == 'Ticket_Category') {
        this.ticketCategory = item.metadata;
      } else if(item.type == 'Ticket_Sub_Category') {
        this.ticketSubCategory = item.metadata;
      } else if(item.type == 'Task_Reason') {
        this.taskReason = item.metadata;
      }
    }
  }

  ticketStatusObj = {
    siteId: null,
    typeId: null,
    ticketStatus: null,
    startDate: null,
    endDate: null
  }

  applyFilter() {
    this.showLoader = true;
    this.inventorySer.filterTicket(this.ticketStatusObj).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.newTicketData = res;
      if(this.newTicketData?.length == 0) {
        this.errMsg = 'No tickets'
      } else {
        this.errMsg = null;
      }
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

  showAddSite = false;
  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;

  showTicket: boolean = false;
  showIndent: boolean = false;
  show(type: string) {
    if (type == 'ticket') { this.showTicket = true }
    if (type == 'indent') { this.showIndent = true }
  }

  closenow(type: String) {
    if (type == 'ticket') { this.showTicket = false }
    if (type == 'indent') { this.showIndent = false }
  }

  taskBody = {
    ticketId: null,
    categoryId: null,
    subCategoryId: null,
    // reasonId: null,
    createdBy: null,
    priorityId: null
  }

  @ViewChild('addTaskDialog') addTaskDialog = {} as TemplateRef<any>;
  openAddTask() {
    // this.currentItem = item;
    this.dialog.open(this.addTaskDialog);
  }

  createTask() {
    this.taskBody.ticketId = this.currentItem?.ticketId;
    this.taskBody.createdBy = this.user?.UserId;
    this.inventorySer.createTask(this.taskBody).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success(res?.message);
    }, (err: any) => {
      this.alertSer.error(err?.error?.message);
    })
  }



  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  @ViewChild('viewTicketDialog') viewTicketDialog = {} as TemplateRef<any>;
  ticketTasks: any[] = [];
  ticketVisits: any[] = [];
  ticketComments: any = [];
  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewTicketDialog);
    this.inventorySer.getTasks(item?.ticketId).subscribe((tasks: any) => {
      // console.log(res);
      this.ticketTasks = tasks;
    });

    this.inventorySer.getTicketVisits(item.ticketId).subscribe((visits: any) => {
      // console.log(res);
      this.ticketVisits = visits;
    });

    // this.inventorySer.getcomments(item.ticketId).subscribe((comments: any) => {
    //   this.ticketComments = comments;
    // });
  }


  @ViewChild('editTicketDialog') editTicketDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.editTicketDialog);
  }

  onInputChange(e: any) {
    this.originalObject = {
      "ticketId": this.currentItem.ticketId,
      "ticketTypeId": e.ticketTypeId,
      "description": e.description,
      "requestedBy": e.requestedBy,
      "sourceOfRequestId": e.sourceOfRequestId,
      "assignedTo": e.assignedTo,
      "priorityId": e.priorityId,
      "statusId": e.statusId,
      "indentRequested": e.indentRequested,
      'ticketReason': e.ticketReason,
      'remarks': e.remarks
    };

    let x = e.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(e: any) {
    this.originalObject = {
      "ticketId": this.currentItem.ticketId,
      "ticketTypeId": e.ticketTypeId,
      "description": e.description,
      "requestedBy": e.requestedBy,
      "sourceOfRequestId": e.sourceOfRequestId,
      "assignedTo": e.assignedTo,
      "priorityId": e.priorityId,
      "statusId": e.statusId,
      "indentRequested": e.indentRequested,
      'ticketReason': e.ticketReason,
      'remarks': e.remarks
    };

    let x = e.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }


  updateTicket(e: any) {
    this.originalObject = {
      "ticketId": this.currentItem.ticketId,
      "ticketTypeId": e.ticketTypeId,
      "description": e.description,
      "requestedBy": e.requestedBy,
      "sourceOfRequestId": e.sourceOfRequestId,
      "assignedTo": e.assignedTo,
      "priorityId": e.priorityId,
      "statusId": e.statusId,
      "indentRequested": e.indentRequested,
      'ticketReason': e.ticketReason,
      'remarks': e.remarks
    };

    this.alertSer.wait();
    this.inventorySer.updateTicket({ticket: this.originalObject, updprops: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listTickets();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  @ViewChild('deleteTicketDialog') deleteTicketDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteTicketDialog)
    // console.log(item);
  }

  confirmDeleteRow() {
    this.inventorySer.deleteTicket(this.currentItem).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.alertSer.success(res?.message);
        this.listTickets();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    })
  }


  assignedObj = {
    assignedTo: null
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  toAssign: any;
  frList: any;
  openAssigned(item: any) {
    this.assignedObj.assignedTo = null;
    this.inventorySer.listUsersByRole().subscribe((res: any) => {
      this.frList = res;
    })
    this.toAssign = item;
    this.dialog.open(this.assignedDialog);
  }

  toAssigned() {
    let myObj = {
      'ticketId': this.toAssign.ticketId,
      'assignedTo': this.assignedObj.assignedTo,
      "assignedBy": this.user?.UserId
    }
    this.inventorySer.assignTicket(myObj).subscribe((res: any) => {
      // console.log(res)
      this.alertSer.success(res?.message);
      this.listTickets();
    }, (err: any) => {
        this.alertSer.error(err?.error?.message);
    })
  }

 

  staObj = {
    status: ""
  }

  // changeAssetStatus() {
  //   let statusObj = {
  //     ticketId: this.y.ticketId,
  //     status: this.staObj.status
  //   }
  //   // this.alertSer.wait();
  //   this.inventorySer.updateTask(statusObj).subscribe((res: any) => {
  //     // console.log(res);
  //     if(res) {
  //       this.alertSer.success(res?.message);
  //       this.listTickets();
  //     }
  //   }, (err: any) => {
  //     if(err) {
  //       this.alertSer.error(err?.error?.message);
  //     };
  //   })
  // }



  /* create comment */

  cmtValue: any;
  newComment: any = [];
  todayDate = new Date();
  createComment() {
    this.newComment.push(this.cmtValue);
    let myObj = {
      'ticketId': this.currentItem.ticketId,
      'message': this.cmtValue,
      'createdBy': this.user?.UserId
    }

    this.inventorySer.createComment(myObj).subscribe((res: any) => {
    this.inventorySer.comment$.next(res);
    });
    this.cmtValue = ''
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.ticketData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sort1(label: any) {
    this.sorted = !this.sorted;
    var x = this.usedItems;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }



 /* checkbox control */

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.ticketData.length; i++) {
      this.ticketData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.ticketData.every(function (item: any) {
      return item.selected == true;
    })
  }

  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewTicketDialog)
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
      this.dialog.open(this.editTicketDialog)
    }
    this.listTickets();
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
        this.ticketData = this.ticketData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.ticketData.forEach((el: any) => {
        this.ticketData = this.ticketData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

}
