import { Injectable, Signal, inject } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { catchError, retry, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';
import { HandleErrorService } from './handle-error.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly URL = environment.websocket_path;;
  private webSocketSubject = webSocket<string>(this.URL);
  public webSocket$ = this.webSocketSubject.asObservable();
  messageService: MessageService = inject(MessageService);
  private error: HandleErrorService = inject(HandleErrorService);

  /**
 * not in use
 */
  updateInterval(interval: number): void {
    this.webSocketSubject.next(JSON.stringify(interval));
  }

  /**
 * subscribe to the websocket to get the messages from mqtt
 */
  doSubscribe(): void {
    this.webSocket$
      .pipe(
        catchError(this.error.handleError('WebSocketService', undefined)),
        retry(2),
        takeUntilDestroyed()
      )
      .subscribe((message: any) => {
        console.log("WebSocketService", message);
        let msg = JSON.parse(message);
        this.messageService.addMessageToGates(msg);
      });
  }
}
