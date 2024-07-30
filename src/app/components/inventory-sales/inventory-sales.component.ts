import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';

@Component({
  selector: 'app-inventory-sales',
  templateUrl: './inventory-sales.component.html',
  styleUrls: ['./inventory-sales.component.css']
})
export class InventorySalesComponent implements OnInit {


  showLoader = false;
  constructor(
    private assetSer: AssetService,
    private alertSer: AlertService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // this.getInventory();
  }


  showInventory:boolean = false;
  showSales:boolean = false;
  open(type:string) {
    if(type == 'inventory') {
      this.showInventory = true;
    }
    if(type == 'sales') {
      this.showSales = true;
    }
  }

  closenow(type:string) {
    if(type == 'sales') {
      this.showSales = false;
    }
    if(type == 'inventory') {
      this.showInventory = false;
    }
  }

}
