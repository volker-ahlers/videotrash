import { Component, Input, Signal, effect, inject } from '@angular/core';

import { MessageComponent } from '../messages/message.component';
import { GateComponent } from '../gates/gate.component';
import { MessageService } from '../services/message.service';
import { IGate, IStream, IStreams } from '../more/types';
import { AlarmStates } from '../more/enums';
import { Router } from '@angular/router';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { CopyObject } from '../more/helper';

@Component({
    selector: 'app-cockpit',
    imports: [GateComponent, MessageComponent, MatExpansionModule],
    templateUrl: './cockpit.component.html',
    styleUrl: './cockpit.component.scss'
})
export class CockpitComponent {

  router: Router = inject(Router);
  messageService: MessageService = inject(MessageService);

  active: AlarmStates = AlarmStates.Active;
  cleared: AlarmStates = AlarmStates.Cleared;

  streams: Signal<IStream[]> = this.messageService.getStreamsSig();
  messagesSig: Signal<IGate[]> = this.messageService.getMessagesFromArrayForCockpit();
  filteredMsgs: IGate[] = [];

  // show debug messages
  debug: boolean = false;

  constructor() {
    /*
    * listen to changes of the messagesarray and filter the messages
    * adapt it to the nessesary format for the cockpit
    * avoid selfreference therefore copyobject
    */
    effect(() => {
      if (this.messagesSig()) {
        this.filteredMsgs = [];
        const messages = CopyObject(this.messagesSig());
        messages.forEach((gate: IGate) => {
          gate.messages = gate.messages.filter((msg) => msg.state === this.active);
          this.filteredMsgs.push(gate);
        });
      }
    });
  }

  /*
   * routing
   * @param gatename: string
   */
  goTo(gatename: string) {
    this.router.navigateByUrl(`gate/${gatename}`);
  }
}
