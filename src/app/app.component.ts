import { Component, isDevMode } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weavers-portal';

  constructor(private userSer: UserService) {}

  user: any = null;
  ngOnInit() {
    isDevMode() ? console.log('Stagging!') : console.log('Production!');
    // this.userSer.user$.subscribe((res) => {
    //   this.user = res;
    // });
  }

  // ngDoCheck() {
  //   let isAuthenticated = this.userSer.getAuthStatus();
  //   if(isAuthenticated) {
  //     this.user = 'Success';
  //   } else {
  //     this.user = null;
  //   }
  // }

}
