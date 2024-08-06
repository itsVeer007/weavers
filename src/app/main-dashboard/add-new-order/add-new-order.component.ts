import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-order',
  templateUrl: './add-new-order.component.html',
  styleUrls: ['./add-new-order.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewOrderComponent implements OnInit {

  constructor(
    private router: Router,
    private inventorySer: InventoryService,
    private fb: UntypedFormBuilder,
    public dialog:MatDialog,

    public alertSer: AlertService,
    public datepipe: DatePipe,
    private storageSer: StorageService,
    private metaDataSer: MetadataService
  ) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<any>();

  UserForm: any =  UntypedFormGroup;
  UserForm1:any = UntypedFormGroup

  inventoryBody = {
    itemRequestId:null,
    quantity: null,
    createdBy: 1,
    remarks: null,
    vendor_id:null,
    color:null,
    quality:null



  }

  // email: string = "";

  user: any;
  ngOnInit() {
    this.listProduct();
    this.getVendor();
    this.user =   JSON.parse(localStorage.getItem('user')!);
    this.form();
    this.form1();
    this.getMetadata()
  }

  form1() {
    this.UserForm1= this.fb.group({
      'vendorId': new UntypedFormControl(''),
      'sgst': new UntypedFormControl(''),
      'cgst': new UntypedFormControl(''),
      'igst': new UntypedFormControl(''),
      'subTotal':new UntypedFormControl(''),
      'grandTotal':new UntypedFormControl(''),

      'cgstPercent': new UntypedFormControl(''),
      'sgstPercent': new UntypedFormControl(''),
      'igstPercent' : new UntypedFormControl(''),
    })
  }

  form() {
    this.UserForm = this.fb.group({
      'itemCode': new UntypedFormControl(''),
      'color': new UntypedFormControl(''),
      'colorCode': new UntypedFormControl(''),
      'orderQuantity': new UntypedFormControl(''),
      'quality': new UntypedFormControl(''),
      'createdBy': new UntypedFormControl(''),
      'cost': new UntypedFormControl(''),
      'amount': new UntypedFormControl(''),
      'quantityIn': new UntypedFormControl(''),
    })
  }

  productMaster:any;
  listProduct() {
  this.inventorySer.listProduct().subscribe((res: any) => {
      console.log(res);
      this.productMaster = res;
    });
  }

  listInventoryForSending1(item:any) {
  this.inventorySer.listInventoryForSending1(item).subscribe((res:any)=> {
  console.log(res)
  })
  }
  

  purchaseOrders: any = [];
  addPurchaseOrder(item: any) {
    let totalAount = item.cost * item.orderQuantity;
    item.amount = totalAount;
    item.createdBy = this.user?.UserId
    if(this.UserForm.valid) {
      this.purchaseOrders.push(item);
      this.calculateTotalCost();
      this.UserForm.reset();
    } else {
      this.alertSer.error('Please fill all fields');
    }
  }

  // getItemNameByCode(item: any) {
  //   this.productMaster.filter((el: any) => {
  //     if(el.suggestedItemCode == item.itemCode) {
  //       return el.itemName
  //     }
  //   })
  // }

  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  proparatorTwo: boolean = false; // proparatorThree: boolean = false;
      activeTwo() {
        this.proparatorTwo = !this.proparatorTwo;
        this.proparatorTwo ? (this.UserForm1.get('sgstPercent').setValue(null), this.UserForm1.get('cgstPercent').setValue(null)) : this.UserForm1.get('igstPercent').setValue(null)
      }
  

  deleteTableItem(index:any) {
    this.purchaseOrders.splice(index, 1);
  }

  totalCost: any;
  calculateTotalCost(): void {
    this.totalCost = this.purchaseOrders.reduce((acc: any, curr: any) => acc + (curr.cost * curr.orderQuantity), 0);
  }

  vendorDetail: any;
  getVendor() {
    this.inventorySer.listVendors().subscribe((res: any) => {
      this.vendorDetail = res;
    })
  }


  closeAddUser() {
    this.newItemEvent.emit();
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit();
    localStorage.setItem('opennewform', newform)
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

  Weavers_Item_Uom:any
  partType: any;
  partCategory: any;
  partCode: any;
  buildType: any;
  Weavers_Quality:any
  getMetadata() {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 54) {
          this.Weavers_Quality = item.metadata;
        } else if(item.type == 49) {
          this.Weavers_Item_Uom = item.metadata;
        } else if(item.type == 'part_code') {
          this.partCode = item.metadata;
        } else if(item.type == 'build_type') {
          this.buildType = item.metadata;
        }
      }
    })
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'No';
  submit() {
    if(this.UserForm.valid) {
      this.alertSer.wait();
      this.inventoryBody.createdBy = this.user?.UserId;
      this.inventorySer.createOrder(this.inventoryBody).subscribe((res: any) => {
        // console.log(res);
        this.newItemEvent.emit();
        this.alertSer.success(res?.message);
      }, (err: any) => {
        this.alertSer.error(err?.error?.message);
      });
    }
  }
  
  sgst:any
  submit1() {
    
    // let sgst = this.UserForm1.value.sgst;
    // let cgst = this.UserForm1.value.cgst;
    // let igst = this.UserForm1.value.igst;

    // let cgstFor = cgst * this.totalCost;
    // let sgstFor = sgst * this.totalCost;
    // let igstFor = igst * this.totalCost;
    // let grandTotalWithCGSTSGST  = this.totalCost + cgst + sgst;
    // let grandTotalWithIGST  = this.totalCost + igst;

    let cgstPercent = this.UserForm1.value.cgstPercent;
    let sgstPercent = this.UserForm1.value.sgstPercent;
    let igstPercent = this.UserForm1.value.igstPercent;

    let cgstFor = (cgstPercent)/100 * this.totalCost;
    let sgstFor = (sgstPercent/100) * this.totalCost;
    let igstFor = (igstPercent/100) * this.totalCost;
  
    let grandTotalWithCGSTSGST  = this.totalCost + cgstFor + sgstFor;
    let grandTotalWithIGST  = this.totalCost + igstFor;

    let userFormOne = this.UserForm1.value;
    
    if( this.UserForm1.value.igstPercent == '') {
      userFormOne.grandTotal = grandTotalWithCGSTSGST;
        userFormOne.subTotal = this.totalCost;
        userFormOne.sgst = sgstFor;
        
        userFormOne.cgst = cgstFor;
        userFormOne.cgstPercent = cgstPercent
        userFormOne.sgstPercent = sgstPercent

        } else {
          userFormOne.subTotal = this.totalCost
          userFormOne.grandTotal = grandTotalWithIGST
          userFormOne.igst = igstFor
          userFormOne.igstPercent = igstPercent
      }
  
    this.UserForm1.value.subTotal = this.totalCost;
    if(this.purchaseOrders.length !== 0) {
      this.purchaseOrders.forEach((el:any)=> {
        el.createdBy =this.user?.UserId;
        if(el.quantityIn === 4) {
          el.quantity = Math.ceil(el.quantity * 1000);
        } else {
          el.quantity = el.quantity;
        }
      })
      this.inventorySer.createPurchaseOrder(this.purchaseOrders ,this.UserForm1.value).subscribe((res: any) => {
          this.newItemEvent.emit();
          this.alertSer.success(res?.message);
        },
        (err: any) => {
          this.alertSer.error(err?.error?.message);
        }
      );
    }
    }




}
