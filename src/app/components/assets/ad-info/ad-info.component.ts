import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ad-info',
  templateUrl: './ad-info.component.html',
  styleUrls: ['./ad-info.component.css']
})
export class AdInfoComponent implements OnInit {

  @Input() myData: any;

  constructor() {

  }

  ngOnInit(): void {
    // console.log(this.myData);
  }

  ngOnChanges() {
    // console.log(this.myData)
  }

}
