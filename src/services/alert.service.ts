import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  config: MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar, private zone: NgZone) {
    this.config = new MatSnackBarConfig();
    this.config.panelClass = ["snackbar-container"];
    this.config.verticalPosition = "bottom";
    this.config.horizontalPosition = "center";
    this.config.duration = 3000;
  }

  snackSuccess(message: any) {
    this.config.panelClass = ["snackbar-container", "success"];
    this.show(message);
  }

  snackError(message: any) {
    this.config.panelClass = ["snackbar-container", "error"];
    this.show(message);
  }

  snackWarning(message: any) {
    this.config.panelClass = ["snackbar-container", "warning"];
    this.show(message);
  }

  show(message: any, config?: MatSnackBarConfig) {
    config = config || this.config;
    this.zone.run(() => {
      this.snackbar.open(message, "x", config);
    });
  }


  /* sweet alert */
  error(message: any) {
    Swal.fire({
      icon: 'error',
      title: 'Failed!',
      text: message,
      showCloseButton: true
    })
  }

  success(message: any) {
    Swal.fire({
      icon: 'success',
      title: `Done!`,
      text: `${message}`,
      showCloseButton: true,
      timer: 3000
    })
  }

  wait() {
    Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    })
  }

  confirmDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if(result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Deleted Successfully",
          icon: "success",
          showCloseButton: true,
          timer: 1000
        });
      }
    });
  }


}
