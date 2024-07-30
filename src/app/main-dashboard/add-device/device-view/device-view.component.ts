import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.css']
})
export class DeviceViewComponent implements OnInit {

  @Input() data: any

  constructor() { }

  ngOnInit(): void {
    // console.log(this.data)
  }

}
