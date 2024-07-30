import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private userSer: UserService,
    private router: Router,
    private storageSer: StorageService,
    private cdr: ChangeDetectorRef
  ) { }


  user: any;
  isManager = false;
  isSales = false;
  ngOnInit(): void {
    // var s = JSON.stringify([{ "DAY": { "SAT cw": "0", "FRI": "0", "THU": "0", "WED": "0", "TUE": "0", "MON": "0", "SUN": "0", "SAT lw": "0" } }, { "WEEK": { "Week-26": "0", "Week-25": "0", "Week-24": "0", "Week-23": "0", "Week-22": "0" } }, { "MONTH": { "JUN-22": "0", "MAY-22": "0", "APR-22": "0", "MAR-22": "0" } }, { "QUARTER": { "Qtr1-21": "0", "Qtr4-20": "0", "Qtr3-20": "0", "Qtr2-20": "0", "Qtr1-20": "0" } }])
    // console.log(JSON.parse(s))
    // this.userSer.user$.subscribe(() => {
      // });
    this.user = JSON.parse(localStorage.getItem('user')!);
    // this.user?.role.forEach((item: any) => {
    //   if(item === 'Administrator') {
    //     this.isAdmin = true;
    //   } else if(item === 'Support') {
    //     this.isSupport = true;
    //   } else if(item === 'FR') {
    //     this.isFr = true;
    //   }
    // })

    if(this.user.UserId == 1669) {
      this.isManager = true;
    } else if(this.user.UserId == 1670) {
      this.isSales = true;
    }
  }

  logout() {
    this.userSer.logout();
  }

  // ngAfterContentChecked(): void {
  //   this.cdr.detectChanges();
  // }

}
