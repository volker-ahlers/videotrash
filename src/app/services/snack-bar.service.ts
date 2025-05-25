import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',

})
export class SnackBarService {

  /**
* displays messages in a predefined way
*/
  constructor(private snackBar: MatSnackBar) { }

  /**It could take three parameters  
    1.the message string  
    2.the action  
    3.the duration, alignment, etc. 
    */
  snackBarSuccess(message: string) {

    this.snackBar.open(message,
      '',
      {
        duration: 2000,
        verticalPosition: 'top', // 'top' | 'bottom'
        horizontalPosition: 'end', //'start' | 'center' | 'end' | 'left' | 'right'
        panelClass: ['snackbar-success']
      });
  }

  snackBarFail(message: string) {
    this.snackBar.open(message,
      '',
      {
        duration: 5000,
        verticalPosition: 'top', // 'top' | 'bottom'
        horizontalPosition: 'end', //'start' | 'center' | 'end' | 'left' | 'right'
        panelClass: ['snackbar-fail']
      });
  }

  snackBarWarning(message: string) {
    this.snackBar.open(message,
      '',
      {
        duration: 5000,
        verticalPosition: 'top', // 'top' | 'bottom'
        horizontalPosition: 'end', //'start' | 'center' | 'end' | 'left' | 'right'
        panelClass: ['snackbar-warning']
      });
  }

  snackBarInfo(message: string) {
    this.snackBar.open(message,
      '',
      {
        duration: 5000,
        verticalPosition: 'top', // 'top' | 'bottom'
        horizontalPosition: 'end', //'start' | 'center' | 'end' | 'left' | 'right'
        panelClass: ['snackbar-info']
      });
  }
}
