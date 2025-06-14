import {
  Component,
  Signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IStream } from '../more/types';
import { MessageService } from '../services/message.service';
import { MessagesDummiService } from '../services/messagesDummi.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class OverviewComponent {
  messageService: MessageService = inject(MessageService);
  messagesDummiService: MessagesDummiService = inject(MessagesDummiService);
  streams: Signal<IStream[]> = this.messageService.getStreamsSig();
  messagesGroupedByGateSig: Signal<any> =
    this.messageService.getMessagesGroupedByGate();
  environment = environment;
  messaging: boolean = false; // show messaging button

  // show debug messages
  debug: boolean = false;

  /*
   * save central messages array in localstorage when closing the app
   */
  constructor() {
    window.onbeforeunload = () => this.messageService.saveMessagesToStorage();
  }

  /*
   * add a message to the messageService on buttonclick to generate dummimessages
   * for testing only
   */
  startMessaging() {
    this.messagesDummiService.startMessaging();
    this.messaging = true;
  }

  stopMessaging() {
    this.messagesDummiService.stopMessaging();
    this.messaging = false;
  }

  /*
   * empty messageobject in messageService on buttonclick
   * delete messageobject in localstorage
   * for testing only
   */
  clearMessages() {
    this.messagesDummiService.clearMessages();
  }

  /*
   * reset SensorLabelSig and ObjectStepSig
   */
  reset() {
    this.messageService.setSensorLabelSig('');
    this.messageService.setObjectStepSig(-1); // reset step
  }

  /*
   * save central messages array in localstorage when closing the app
   */
  ngOnDestroy() {
    console.log('store messages on destroy');
    this.messageService.saveMessagesToStorage();
    this.messagesDummiService.stopMessaging(); // stop messaging when component is destroyed
  }
}
