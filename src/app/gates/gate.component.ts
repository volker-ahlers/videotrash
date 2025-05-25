import { Component, Input, Signal, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IMessage, IStream, Stream, Timeslot, ITimeslot, objectsList } from '../more/types';
import { MessageService } from '../services/message.service';
import { SnackBarService } from '../services/snack-bar.service';
import { VideoComponent } from '../video/video.component';
import { Cathegory } from '../more/enums';
import { environment } from '../../environments/environment';
import { AlarmStates } from '../more/enums';
import { Router } from '@angular/router';


@Component({
  selector: 'app-gate',
  standalone: true,
  imports: [
    CommonModule,
    VideoComponent,
    MatButtonModule
  ],
  templateUrl: './gate.component.html',
  styleUrls: ['./gate.component.scss']
})
export class GateComponent {

  @ViewChild('videoapp', { static: true }) videoapp: any;

  messageService: MessageService = inject(MessageService);
  private snackBarService: SnackBarService = inject(SnackBarService);
  router: Router = inject(Router);


  @Input() stream: IStream = new Stream();
  @Input() name: string = "";
  @Input() view: "cockpit" | "gate" = "cockpit";

  streams: Signal<IStream[]> = this.messageService.getStreamsSig();
  active: AlarmStates = AlarmStates.Active;
  cleared: AlarmStates = AlarmStates.Cleared;

  objectStepSig: Signal<number> = this.messageService.getObjectStepSig();
  messagesGroupedByGateSig: Signal<any> = this.messageService.getMessagesGroupedByGate();
  selectedMessage: Signal<IMessage | null> = this.messageService.getSelectedMessageSig();
  activeMessagesCount: number = 0;
  lastMessageDate: string = "";
  objectMax: number = -1;
  Cat: any = Cathegory;
  timeslot: ITimeslot = new Timeslot();
  timeslotStartLabel = "pick startpoint"
  timeslotEndLabel = "pick endpoint"
  timeslotSendLabel = "nicht erkannt"
  timeslotLabel: string = "";
  sendtimeslot: boolean = true;
  /*
 * iterate over enums:
 * https://blog.logrocket.com/iterate-over-enums-typescript/
 * ObjectsToSelect: string[] = Object.keys(Objects).filter((v) => isNaN(Number(v)));
 */
  objectsToSelect: string[];
  selectedObjectKey: string | null = null;
  seconds: number = 0;
  // show debug messages
  debug: boolean = false;

  constructor() {
    this.objectsToSelect = this.messageService.getLabels();
    this.debug && console.log("this.objectsToSelect", this.objectsToSelect);
    effect(() => {
      console.log(this.messagesGroupedByGateSig()[this.stream.name]);
      /*
      * listen to message object
      * update activeMessagesCount, objectMax
      * handle movie if no messages are left
      */
      if (this.messagesGroupedByGateSig()[this.stream.name]) {
        this.activeMessagesCount = this.messageService.getActiveMessagesCnt(this.stream.name, this.constructor.name);
      } else {
        this.activeMessagesCount = 0;
      }

      if (this.activeMessagesCount > 0) {
        this.objectMax = this.activeMessagesCount - 1;
        this.lastMessageDate = this.messagesGroupedByGateSig()[this.stream.name][this.objectMax].timestamp;
      }

      //@ts-ignore
      this.seconds = this.selectedMessage()?.frame_id ? this.selectedMessage()?.frame_id / 25 : 0;
    });
  }

  ngOnInit() {

    this.getStreamByName(this.name);
    this.resetTimeslot();
    try {
      /*
      * trigger update of messages
      */
      if (this.view === "gate") {
        this.messageService.prepareMessages();
      }

    } catch (ex: any) {
      alert(this.name);
      this.router.navigateByUrl('/');
    }
  }

  /*
 * test by parsing the date if it's valid datestring
 */
  parseDate(date: string) {
    try {
      // if (date === null) return false;
      return Date.parse(date) > 0
    }
    catch (ex: any) {
      return false;
    }
  }

  /*
  * get streams by gatename
  * @param name: string
  */
  getStreamByName(gatename: string): void {
    this.debug && console.log("this.sensor_label-name", gatename);
    this.stream = this.streams().filter((stream) => stream.name === gatename)[0];
    if (this.stream === undefined) {
      this.snackBarService.snackBarFail(`Stream ${this.name} not found`);
      this.router.navigateByUrl('/');
    }
  }

  /*
  * read message_id and delegate to markObject
  * @param cathegory: string
  */
  correctMessage(cathegory: string) {
    const message_id = this.selectedMessage()?.message_id;
    this.markObject(cathegory, message_id);
    console.log(this.selectedMessage());
  }

  /*
  * update global messageobject
  * trigger messages signal
  * update of messages in table 
  * if selected message was the last one reduce objectStepSig
  * in this case as update of objects length response is too late, so substract 2 instead of one, even it looks ackward
  * @param cathegory: string
  * @param message_id: string
  */
  markObject(category: string, message_id?: string) {
    if (message_id) {
      //this.messageService.markMessageFromGate(this.stream.name, message_id, category);
      this.messageService.messageHandleService(this.stream.name, message_id, category);
      if ((this.activeMessagesCount - 1) === this.objectStepSig()) {
        this.messageService.setObjectStepSig((this.activeMessagesCount - 2));
      }
    } else {
      console.log(message_id + "not found");
    }
  }

  /*
  * step backward
  * go to last if previous is not possible
  */
  previous() {
    this.messageService.updateObjectStepSig(-1);
    this.resetTimeslot();
    if (this.objectStepSig() < 0) {
      this.messageService.setObjectStepSig(this.objectMax);
    }
  }

  /*
  * step forward
  * go to forst if next is not possible
  */
  next() {
    this.messageService.updateObjectStepSig(1);
    this.resetTimeslot();
    if (this.objectStepSig() > this.objectMax) {
      this.messageService.setObjectStepSig(0);
    }
  }

  /*
  * route to gate if button is clicked (only in cockpit)
  */
  proveGate() {
    this.debug && console.log("proveGate", this.stream.name);
    this.messageService.setObjectStepSig(-1); // reset step
    // this.resetTimeslot();
    this.router.navigateByUrl(`gate/${this.stream.name}`);
  }

  /*
  * show movie again
  * resume movie at the newest point
  */
  maintain() {
    this.messageService.setObjectStepSig(-1);
    this.videoapp.resume();
  }

  /*
  * resume movie at the newest point, when it was stopped
  */
  resume() {
    this.videoapp.resume();
    this.resetTimeslot();
  }

  /*
  * select object from a list to add it#s id to the screenshot's filename
  */
  selectObject(e: any) {
    this.selectedObjectKey = isNaN(Number(e.target.value)) ? null : e.target.value;
    console.log("selectedObjectKey", this.selectedObjectKey);
  }

  /*
  * take a timeframe with start ans endpoint, 'convert' to frameid
  */
  takeTimeslot() {
    this.timeslot.sensor_label = this.stream.name;
    this.timeslot.object_id = this.selectedObjectKey;
    if (this.timeslot.start_frame === 0) {
      this.timeslot.start_frame = Math.round(this.videoapp.hlsvideo.nativeElement.currentTime * 25);
      this.timeslotLabel = this.timeslotEndLabel;
    } else if (this.timeslot.end_frame === 0) {
      this.timeslot.end_frame = Math.round(this.videoapp.hlsvideo.nativeElement.currentTime * 25);
      this.timeslotLabel = this.timeslotSendLabel;
      this.sendtimeslot = false;
    } else {
      this.sendTimeslot();
    }
  }

  /*
 * sort the timestamps and
 * send the timeslot
 */
  sendTimeslot() {
    if (this.timeslot.start_frame > this.timeslot.end_frame) {
      const temp = this.timeslot.start_frame;
      this.timeslot.start_frame = this.timeslot.end_frame;
      this.timeslot.end_frame = temp;
    }
    console.log(this.timeslot);
    this.messageService.setTimeslot(this.timeslot);
    this.resetTimeslot();
  }

  /*
* resets the timeslot, resets selected parameters
*/
  resetTimeslot() {
    this.timeslot = new Timeslot();
    this.timeslotLabel = this.timeslotStartLabel;
    this.sendtimeslot = true;
  }

  ngOnDestroy() {
    console.warn("destroyed", this.constructor.name, this.view, this.name, this.stream?.name);
  }
}

