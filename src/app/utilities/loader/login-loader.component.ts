import { Component } from '@angular/core';

@Component({
  selector: 'app-login-loader',
  template: `
    <div class="bg">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `,
  styles: [`
    .bg {
      position: absolute;
      top: 0;width: 100%;
      height: 100%;
      background: rgb(28, 74, 130, 0.5);
      z-index: 49;
      background-image: linear-gradient(to right, #fff,#00573c);
      text-align: center;
    }

    .lds-ellipsis {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -40px;
      margin-top: -40px;
    }

    .lds-ellipsis div {
      position: absolute;
      top: 50%;
      margin-left: auto;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #104b86;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    .lds-ellipsis div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }

    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }

    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }
  `]
})

export class LoginLoaderComponent { }
