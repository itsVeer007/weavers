import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewUserComponent implements OnInit {

  constructor(private router:Router, private userSer: UserService, private fb: UntypedFormBuilder, private http: HttpClient) { }

  // @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();

  // @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`user`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddUser(false);
  //     }
  //   }
  // }
  // error=false;


  UserForm: any =  UntypedFormGroup;

  user = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    roleList: [],
    email: "",
    gender: "",
    realm: "",
    contactNumber1: "",
    contactNumber2: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    city: "",
    pin: "",
    employee: "F",
    employeeId: "",
    accesstoken: "",
    callingUsername: "",
    callingSystemDetail: "admin",
    safetyEscort: "F"
  }


  ngOnInit() {
    this.UserForm = this.fb.group({
      'userName': new UntypedFormControl('', Validators.required),
      'password': new UntypedFormControl('', Validators.required),
      'first': new UntypedFormControl('', Validators.required),
      'last': new UntypedFormControl('', Validators.required),
      // 'gender': this.fb.group({
      //        cityName: ['']
      //       }),
      // 'employeeId': new FormControl(''),
      'role': new UntypedFormControl('', Validators.required),
      'gender': new UntypedFormControl('', Validators.required),
      'realm': new UntypedFormControl('', Validators.required),
      'email': new UntypedFormControl('', Validators.required),
      'contact_1': new UntypedFormControl('', Validators.required),
      'contact_2': new UntypedFormControl(''),
      'address_1': new UntypedFormControl('', Validators.required),
      'address_2': new UntypedFormControl(''),
      'country': new UntypedFormControl('', Validators.required),
      'state': new UntypedFormControl('', Validators.required),
      'city': new UntypedFormControl('', Validators.required),
      'pincode': new UntypedFormControl('', Validators.required),
      'district': new UntypedFormControl('', Validators.required),
      'safetyEscort': new UntypedFormControl(''),
      // 'employee': new FormControl('')
    });

    // this.getUserDetails();
    this.getCountry();
  }

  countryList: any;
  getCountry() {
    this.http.get("assets/JSON/countryList.json").subscribe((res: any) => {
      this.countryList = res;
    })
  }

  stateList: any = [];
  filterState(val: any) {
    let x = this.countryList.filter((el: any) => el.countryName == val);
    let y = x.flatMap((el: any) => el.states);
    this.stateList = y;
  }

  cityList: any
  filterCity(val: any) {
    let x = this.stateList.filter((el: any) => el.stateName == val);
    let y = x.flatMap((el: any) => el.cities);
    this.cityList = y;
  }

  email: string = "";
  getUserDetails(){
    this.userSer.getUser(this.email).subscribe((res:any)=>{
      // console.log(res)
      if(res.Status == 'Success'){
        this.user.username= "";
        // this.user.password= res.password;
        this.user.firstname= res.firstName;
        this.user.lastname= res.lastName;
        this.user.roleList = res.roleList;
        this.user.email= res.email;
        this.user.gender= res.gender;
        this.user.realm= res.realm;
        this.user.contactNumber1= res.contactNo1;
        this.user.contactNumber2= res.contactNo2;
        this.user.country= res.country;
        this.user.addressLine1= res.address_line1;
        this.user.addressLine2= res.address_line2;
        this.user.district= res.district;
        this.user.state= res.state;
        this.user.city= res.city;
        this.user.pin= res.pin;
        this.user.employee= res.employee;
        this.user.employeeId= res.empId;
        this.user.accesstoken= res.access_token;
        this.user.callingUsername= res.callingUsername;
        this.user.callingSystemDetail = "portal";
        this.user.safetyEscort = res.safetyescort;
      }
    })
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit();
    localStorage.setItem('opennewform', newform)
  }


  addUser0: any;
  addUser1: any;
  addUser2: any;
  submit() {
    if(this.UserForm.valid) {
      this.newItemEvent.emit();

      this.addUser2 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      });

      this.userSer.addUser(this.user).subscribe((res: any) => {
        if(res.Status == "Success") {
          localStorage.setItem('userCreated', JSON.stringify(res));
        }

        if(res) {
          this.addUser1 = Swal.fire({
            icon: 'success',
            title: 'Done!',
            text: 'Created User Successfully!',
          });
        }

      }, (err: any) => {
        if(err) {
          this.addUser0 = Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'User Creation failed',
            // timer: 3000,
          });
        };
      });
    }

    // console.log(this.user);
  }


  // checkbox: boolean = false;
  // onCheck() {
  //   this.checkbox = !this.checkbox;
  // }

}

