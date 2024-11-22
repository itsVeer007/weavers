import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { ChartService } from 'src/services/chart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from 'src/services/inventory.service';
import { MatDialog } from '@angular/material/dialog';
import { RawMaterialsComponent } from '../components/raw-materials/raw-materials.component';


@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css'],
  // animations: [
  //   trigger("inOutPaneAnimation", [
  //     transition(":enter", [
  //       style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
  //       animate(
  //         "500ms ease-in-out",
  //         style({ opacity: 1, transform: "translateX(0)" })
  //       )
  //     ]),
  //     transition(":leave", [
  //       style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
  //       animate(
  //         "500ms ease-in-out",
  //         style({ opacity: 0, transform: "translateX(100%)" })
  //       )
  //     ])
  //   ])
  // ]
})
export class MainDashboardComponent implements OnInit {
  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    // var x = <HTMLElement>document.getElementById(`icons-site`);
    // if (x != null) {
    //   if (!x.contains(e.target)) {
    //     this.icons111 = false;
    //   }
    // }

    var y = <HTMLElement>document.getElementById(`icons1${this.currentid}`);
    if (y != null) {
      if (!y.contains(e.target.parentNode.previousElementSibling)) {
        if (y.style.display == 'flex' || y.style.display == 'block') {
          y.style.display = 'none';
        }
      }
    }
  }

  constructor(
    private chartservice: ChartService,
    public dialog: MatDialog,
    private http: HttpClient,
    private route: ActivatedRoute,
    private inventorySer: InventoryService,
    private router: Router
  ) {}

  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;

  ngOnInit(): void {
    this.getMainDashboardCardReport();
    this.getMainDashboardReport();
    this.mychart();
    this.mychart1();
    // this.mychart2();
    // this.mychart3();
    // this.mychart4();
    // this.dashboard();
    this.listDashboard()
    this.weaversProduction()
  }

 

  Weavers_Item_Uom: any;
  getMetaData() {
    let data = JSON.parse(localStorage.get('metadata')!);
    for (let item of data) {
      if (item.typeName == 'Weavers_Item_Uom') {
        this.Weavers_Item_Uom = item.metadata;
      }
    }
  }

  showLoader = false;
  searchText: any;
  searchTx: any;
  inventoryTable: any = [];
  newInventoryTable: any = [];

  inStock: any;
  dispatched: any;
  installed: any;
  purchases: any;
  others: any;
  listInventory() {
    this.showLoader = true;
    this.inventorySer.listInventory().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      // this.getMetadata();
      this.inventoryTable = res;
      // this.removeDuplicates();
      this.newInventoryTable = this.inventoryTable;
      this.getMetaData();
    });
  }

  mainDataRaw: any = [];
  FinalData: any;
  listInventoryForRaw() {
    this.inventorySer.listInventoryForRaw().subscribe((res: any) => {
      // console.log(res);
      this.FinalData = res;
      this.mainDataRaw = this.FinalData;
    });
  }

  newdata:any =[]
  dashdata: any = [];
  weaversProduction(item?:any) {
    this.inventorySer.weaversProduction(item).subscribe((res: any) => {
      console.log(res);
      this.dashdata = res;
      this.newdata = this.dashdata;
      this.filterBody1.startDate = null;
          this.filterBody1.endDate = null
    });
  }


  newDashdata:any = [];
  listdashdata:any =[];
  listDashboard() {
    this.inventorySer.listDashboard().subscribe((res: any) => {
      console.log(res);
      this.listdashdata = res;
      this.newDashdata = this.listdashdata;
    });
  }

  filterBody1 = {
    startDate: null,
    endDate: null,
  };

  
  filterBody2 = {
    startDate: null,
    endDate: null,
  };
  // filterDash() {
  //   this.inventorySer.Filterdashboard(this.filterBody).subscribe((res: any) => {
  //     console.log(res);
  //     this.newDashdata = this.listdashdata;
  //     this.filterBody.startDate = null;
  //     this.filterBody.endDate = null
  //   });
  // }

  open(item: any) {
    this.inventorySer.itemNameSource.next(item.itemName);
    if (item.itemType === 1) {
      this.router.navigate(['/main/raw-Materials']);
    } else if (item.itemType === 2) {
      this.router.navigate(['/main/inventory']);
    }
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.FinalData;
    // var y = this.inventoryItems;
    if (this.sorted == false) {
      x.sort((a: string, b: string) =>
        a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0
      );
      // y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) =>
        b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0
      );
      // y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  openicons11(i: any) {
    var y = <HTMLElement>document.getElementById(`icons1${this.currentid}`);
    if (y.style.display == 'flex' || y.style.display == 'block') {
      y.style.display = 'none';
    }
  }

  showAddSite = false;

  closenow(value: any, type: String) {
    if (type == 'site') {
      this.showAddSite = value;
    }
    if (type == 'camr') {
      this.showAddCamera = value;
    }
    if (type == 'cust') {
      this.showAddCustomer = value;
    }
    if (type == 'vert') {
      this.showAddBusinessVertical = value;
    }
    if (type == 'user') {
      this.showAddUser = value;
    }

    // setTimeout(() => {
    //   var openform = localStorage.getItem('opennewform');
    //   if (openform == 'showAddSite') { this.showAddSite = true; }
    //   if (openform == 'showAddCamera') { this.showAddCamera = true; }
    //   if (openform == 'showAddCustomer') { this.showAddCustomer = true; }
    //   if (openform == 'showAddBusinessVertical') { this.showAddBusinessVertical = true; }
    //   if (openform == 'showAddUser') { this.showAddUser = true; }
    //   localStorage.setItem('opennewform', '');
    // }, 100)
    /*
        console.log(value,type)
    if(type=='site'){this.showAddSite = value;}else{this.showAddSite = false;};
    if(type=='camera'){this.showAddCamera = value;}else{this.showAddCamera = false;};
    if(type=='cust'){this.showAddCustomer = value;}else{this.showAddCustomer = false;};
    if(type=='user'){this.showAddUser = value;}else{this.showAddUser = value;};
    if(type=='none'){this.showAddUser = value;}else{this.showAddUser = value;};
    */
  }

  showIconVertical: boolean = false;
  showIconCustomer: boolean = false;
  showIconSite: boolean = false;
  showIconCamera: boolean = false;
  showIconAnalytic: boolean = false;
  showIconUser: boolean = false;

  cardReport: any;
  getMainDashboardCardReport() {
    this.getNoOfElements();
    // this.http.get('assets/JSON/verticalCard.json').subscribe((res) => {
    //   this.cardReport = res;
    //   // console.log(res)
    //   var a = JSON.parse(JSON.stringify(res));
    //   // console.log(this.noOfCards);
    //   this.showcardReport = a.splice(0, this.noOfCards);
    // });
    // this.inventorySer.dashboard().subscribe((res:any)=> {
    //   this.cardReport = res;
    //   var a = JSON.parse(JSON.stringify(res));
    //   this.showcardReport = a.splice(0, this.noOfCards);
    // })
  }



  noOfCards = 4;
  getNoOfElements() {
    var x = document.body.clientWidth;
    // console.log(x);
    if (x < 400) {
      this.noOfCards = 1;
    }
    if (x > 400) {
      this.noOfCards = 1;
    }
    if (x > 500) {
      this.noOfCards = 2;
    }
    if (x > 700) {
      this.noOfCards = 3;
    }
    if (x > 900) {
      this.noOfCards = 4;
    }
    if (x > 1400) {
      this.noOfCards = 5;
    }
    // console.log(this.noOfCards)
  }

  mainReport: any;
  count: any;
  totalCust: any = 0;
  totalSites: any = 0;
  totalCams: any = 0;
  totalAna: any = 0;
  totalUsers: any = 0;
  getMainDashboardReport() {
    this.http.get('assets/JSON/mainDashboard.json').subscribe((res) => {
      this.mainReport = res;
      // console.log(res)
      this.count = Object.keys(res).length;
      this.mainReport.forEach((el: any) => {
        this.totalCust += Number(el.customerCount);
        this.totalSites += Number(el.sitesCount);
        this.totalCams += Number(el.camerasCount);
        this.totalAna += Number(el.analyticsCount);
        this.totalUsers += Number(el.usersCount);
      });
    });
  }

  showmenu(event: any) {
    var x = event.target.parentNode.previousElementSibling;
    // console.log(x.style)
    // var x = <HTMLElement>document.getElementById("icons");
    // x.style.display = "flex";
    // x.style.opacity = "1";
    // x.style.zIndex = "999";
    // console.log(x.style.display);
    // console.log(x.style.opacity);
  }


  startDate:any
  endDate:any

  salesStartDate:any
  salesEndDate:any

  productionStartDate:any
  productionEndDate:any

  mychart() {
    this.chartservice.salesGraph({startDate:this.salesStartDate, endDate:this.salesEndDate}).subscribe({
      next: (res: any) => {
        var charttype = 'column';
        var threeD = false;
        var title = 'TOTAL SALES GRAPH';
        // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
        //var antype = 'Minutes';
        var elementid = 'chart';
        var antype = 'year';
        var data = res;

        
        this.chartservice.create(
          charttype,
          threeD,
          title,
          data,

          elementid,
          antype,
        );
      }
    })
  }

  mychart1() {
    this.chartservice.productionGraph({startDate:this.productionStartDate, endDate:this.productionEndDate}).subscribe({
      next: (res:any)=> {
        var charttype = 'column';
        var threeD = false;
        var title = 'TOTAL PRODUCTION GRAPH';
        // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
        // var antype = 'Minutes';
        var elementid = 'chart1';
        var antype = 'year';
        var data = res;

   
        this.chartservice.create1(
          charttype,
          threeD,
          title,
          data,
       
          elementid,
          antype,
        );
      }
    })
  
  }

  // mychart2() {
  //   var charttype = 'line';
  //   var threeD = false;
  //   var title = 'TOTAL SALES REPORT - 49';
  //   // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
  //   // var antype = 'Minutes';
  //   var elementid = 'chart2';
  //   var antype = 'year';
  //   var data = [
  //     ['40', 40],
  //     ['66', 66],
  //     ['50', 50],
  //     ['70', 70],
  //     ['10', 10],
  //     ['40', 40],
  //     ['91', 91],
  //     ['40', 40],
  //     ['40', 40],
  //     ['66', 66],
  //     ['80', 80],
  //     ['100', 100],
  //   ];
  //   this.chartservice.createchart(
  //     charttype,
  //     threeD,
  //     title,
  //     data,
  //     elementid,
  //     antype
  //   );
  // }

  // icons111: boolean = false;
  openIcon(type: any) {
    if (type == 'site') {
      this.showAddSite = true;
    }
    if (type == 'user') {
      this.showAddUser = true;
    }

    // this.icons111 = !this.icons111;
    // this.showIconVertical = false;
    // this.showIconCustomer = false;
    this.showIconSite = false;
    // this.showIconCamera = false;
    // this.showIconAnalytic = false;
    this.showIconUser = false;

    // var x:any ;
    // if (type == 'site') { x = <HTMLElement>document.getElementById('site')!; console.log(type, x)  }
    // if (type == 'camr') { x = <HTMLElement>document.getElementById('camr')!; console.log(type, x)  }
    // if (type == 'cust') { x = <HTMLElement>document.getElementById('cust')!; console.log(type, x)  }
    // if (type == 'vert') { x = <HTMLElement>document.getElementById('vert')!; console.log(type, x)  }
    // if (type == 'user') { x = <HTMLElement>document.getElementById('user')!; console.log(type, x)  }
    // x.style.display = "block";
    // x.style.animation= "slideIn 1.2s";
  }

  icons11: boolean = false;
  currentid = 0;
  iconss1(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.previousElementSibling;
    // console.log(x.id)
    if (x.id.includes('icons1')) {
      if (x.style.display == 'none') {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
    }
  }

  showcardReport: any;
  prevvert() {
    var indexOfFirstElem = this.cardReport
      .map((item: any) => {
        return item.itemCode;
      })
      .indexOf(this.showcardReport[0].itemCode);

    // console.log(indexOfFirstElem, (this.cardReport.length - 1))
    if (indexOfFirstElem != 0) {
      indexOfFirstElem = indexOfFirstElem -= 1;
      var a = JSON.parse(JSON.stringify(this.cardReport));
      this.showcardReport = a.splice(indexOfFirstElem, this.noOfCards);
    }
  }

  nextvert() {
    var indexOfFirstElem = this.cardReport
      .map((item: any) => {
        console.log(item)
        return item.itemCode;
      })
      .indexOf(this.showcardReport[0].itemCode);

    // console.log(indexOfFirstElem, (this.cardReport.length - 1))
    if (indexOfFirstElem + this.noOfCards < this.cardReport.length) {
      indexOfFirstElem = indexOfFirstElem += 1;
      var a = JSON.parse(JSON.stringify(this.cardReport));
      this.showcardReport = a.splice(indexOfFirstElem, this.noOfCards);
    }
  }
  
}
