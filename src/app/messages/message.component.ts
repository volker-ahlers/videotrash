import { Component, Input, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMessage, Message } from '../more/types';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-message',
    imports: [
        CommonModule,
        MatButtonModule
    ],
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  router: Router = inject(Router);
  messageService: MessageService = inject(MessageService);
  objectStepSig: Signal<number> = this.messageService.getObjectStepSig();
  selectedMessage: Signal<IMessage | null> = this.messageService.getSelectedMessageSig();

  @Input() message: IMessage = new Message();
  @Input() showInfo: "cockpit" | "object" = "object";
  @Input() step!: number;

  // show debug messages
  debug: boolean = false;

  ngOnInit() { }

  /*
  * test by parsing the date if it's valid datestring
  */
  parseDate(date: string) {
    return Date.parse(date) > 0
  }

  /*
  * get the color for the object related to its value
  * if it*s necessary
  */
  getObjectColor() {
    const val = this.message.object.confidence * 100;
    // if (val < 50) return 'warn';
    // if (val >= 50 && val < 100) return 'alarm';
    // if(this.message.state === AlarmStates.Supressed) -- wird nicht angezeigt
    // return AlarmStates.Supressed.toLowerCase();
    if (val > 90) return 'ok';
    else return 'alarm';
  }

  /*
  * if embedded/used in the cockpit -> route to the object and gate related to the message_ID
  * if embedded/used in the single view: -> select and show messageinformation from messagearray
  */
  checkMessage() {
    this.messageService.setSelectedMessage(this.message);
    if (this.showInfo === "cockpit") {
      this.router.navigateByUrl(`gate/${this.message.sensor_label}`);
    } else {
      this.messageService.prepareMessages();
    }
  }
}
