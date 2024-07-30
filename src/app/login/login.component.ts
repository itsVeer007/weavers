import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private userSer: UserService,
    private siteSer: SiteService,
    private route: Router,
    private fb: UntypedFormBuilder,
    private router: Router,
    private alertSer: AlertService,
    private metaDataSer: MetadataService,
    private storageSer: StorageService
  ) { }

  user = null;
  showLoader: boolean = false;
  loginForm: any = UntypedFormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    localStorage.clear();
    // this.userSer.user$.subscribe((res: any) => {
    //   this.user = res
    // });
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginNew() {
    if(this.loginForm.valid) {
      this.showLoader = true;
      this.userSer.loginNew(this.loginForm.value).subscribe((res: any) => {
        this.showLoader = false;
        if(res?.Status == 'Success') {
          this.userSer.isLoggedin.next(true);
          localStorage.setItem('user', JSON.stringify(res));
          this.userSer.user$.next(res);
          this.getMetadata();
          // res.role.forEach((item: any) => {
          //   if(item === 'Administrator') {
          //     this.router.navigate(['main/wifi-ads'])
          //   } else if(item === 'Support') {
          //     this.router.navigate(['main/product-master']);
          //   } else if(item === 'FR') {
          //     this.router.navigate(['main/fr-kit']);
          //   }
          // })
          if(res.UserId == 1669) {
            // this.router.navigate(['main/product-master']);
            this.router.navigate(['/main/main-dashboard']);
          } else if(res.UserId == 1670) {
            // this.router.navigate(['main/sales-dashboard']);
          }
        } else if(res?.Status == 'Failed') {
          this.alertSer.snackError(res?.message);
        }
      }, (err: any) => {
        this.showLoader = false;
        this.alertSer.snackError(err?.error?.message);
      })
    }
  }

  getMetadata() {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      localStorage.setItem('metaData', JSON.stringify(res));
    })
  }

}
