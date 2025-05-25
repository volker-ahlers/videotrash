import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SnackBarService } from './snack-bar.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',

})
export class HandleErrorService {

  $sub: Subscription = new Subscription();
  private snackBarService: SnackBarService = inject(SnackBarService);

  /**
* handles errors in a predefined way
*/
  public handleError<T>(errorMessage = "", result?: T, snackbar: boolean = true) {

    return (error: any): Observable<T> => {

      const msg = `Error while running ${errorMessage}, please have a look at the Logfiles`;
      // Display the error to the user via the snack-bar
      if (snackbar)
        this.snackBarService.snackBarFail(msg);
      console.log(error);

      // Rethrow the error for the caller to handle
      throw error;
    };
  }

  onDestroy() {
    this.$sub.unsubscribe();
  }
}
