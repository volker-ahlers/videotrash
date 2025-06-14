import { Injectable, Signal, inject } from '@angular/core';
import { IMessage, Message } from '../more/types';
import { getRandomArbitrary, plateNumber } from '../more/helper';
import * as uuid from 'uuid';
import { MessageService } from './message.service';
import { IStream } from '../more/types';
import { AlarmStates } from '../more/enums';
import { environment } from 'src/environments/environment';

/**
 * create messages for presentation without any docker services.
 */

@Injectable({
  providedIn: 'root',
})
export class MessagesDummiService {
  messageService: MessageService = inject(MessageService);

  streams: Signal<IStream[]> = this.messageService.getStreamsSig();

  textArray: string[] = [];

  // show debug messages
  debug: boolean = false;

  randomDelay = 1000;
  timeoutId: ReturnType<typeof setTimeout> | null = null;

  startMessaging(): void {
    const min = 200; // minimum delay in ms
    const max = 4000; // maximum delay in ms

    const tick = () => {
      this.addMessage();
      const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
      this.timeoutId = setTimeout(tick, randomDelay);
    };

    tick(); // Start the first tick
  }

  stopMessaging(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * create and fill dummi message
   */
  addMessage() {
    let l =
      this.streams() && this.streams().length ? this.streams().length : 10;

    this.textArray = this.messageService.getLabels();
    let msg: IMessage = new Message();
    msg.message_id = uuid.v4();
    msg.mds_version = '1.0';
    msg.sensor_id = getRandomArbitrary(170, 22);
    // msg.sensor_label = "Tor " + getRandomArbitrary(1, (l + 1));
    msg.sensor_label = this.streams()[getRandomArbitrary(0, l)].name;
    msg.timestamp = new Date().toISOString();
    msg.frame_id = 25 * getRandomArbitrary(1, 4);
    msg.buf_pts = msg.frame_id * 1000 * 1000;
    msg.step = 0;
    msg.state = AlarmStates.Active;
    msg.category = '';
    msg.lpn = plateNumber.genPlateNumber();
    msg.image_path = `${environment.images_storage_url}${getRandomArbitrary(
      1,
      6
    )}.jpg`;

    // don't allow doubled message_id's
    if (this.compareIfDoubledId(msg.message_id)) return;

    const label_id = getRandomArbitrary(this.textArray.length);

    msg.object.label_id = label_id;
    msg.object.confidence = Math.random();
    msg.object.label = this.textArray[label_id];

    const max = 999;
    msg.object.bbox.topleftx = getRandomArbitrary(max, 0);
    msg.object.bbox.toplefty = getRandomArbitrary(max, 0);
    msg.object.bbox.bottomrightx = getRandomArbitrary(max, 0);
    msg.object.bbox.bottomrighty = getRandomArbitrary(max, 0);

    this.debug && console.log('Add Dummi-Message', msg);
    this.messageService.addMessageToGates(msg);
  }

  /**
   * empty central array of gates and localstore.
   */
  clearMessages() {
    this.messageService.clearMessages();
  }

  /**
   * avoid adding messages with already existing doubled message_id's
   * @param value message_id
   */
  compareIfDoubledId(message_id: string): boolean {
    const str = JSON.stringify(this.messageService.messagesGroupedByGate());
    if (str.includes(message_id)) {
      console.error('Doublette', message_id);
      return true;
    } else {
      this.debug && console.log(message_id);
      return false;
    }
  }
}
