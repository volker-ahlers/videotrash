import { CommonModule } from '@angular/common';
import { Component, Signal, effect, inject, ViewChild } from '@angular/core';
import { MessageService } from '../services/message.service';
import { IGate, IMessage } from '../more/types';
import { TableModule, Table } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { AlarmStates, Cathegory } from '../more/enums';
import { PanelfilterComponent } from '../panelfilter/panelfilter.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-journal',
    imports: [CommonModule, TableModule, RouterModule, PanelfilterComponent, MatIconModule],
    templateUrl: './journal.component.html',
    styleUrl: './journal.component.scss'
})
export class JournalComponent {

  @ViewChild('dt') dt!: Table;

  router: Router = inject(Router);
  messageService: MessageService = inject(MessageService);
  messagesSig: Signal<IGate[]> = this.messageService.getMessagesFromArrayForCockpit();
  messages: IMessage[] = [];
  temp_messages: IMessage[] = [];

  gateList: string[] = [];
  labelList: string[] = [];
  lpnList: string[] = [];
  catList: string[] = [];
  stateList: string[] = [];

  objectsToSelect: string[] = [];

  active: string = AlarmStates.Active;
  first: number = 0;
  selectedPage: number = 0;
  automaticrefresh: boolean = false;

  // show debug messages
  debug: boolean = false;

  constructor() {
    console.log("JournalComponent", this.first);
    this.objectsToSelect = this.messageService.getLabels();
    /*
    * get all the different values for the filterdropdowns sorted by the values
    */
    Object.values(AlarmStates).forEach((value) => {
      this.stateList.push(value);
    });
    Object.values(Cathegory).forEach((value) => {
      this.catList.push(value);
    });
    this.updateMessageList();

    /*
    * listen to changes of the messagesarray and filter the messages
    * adapt it to the nessesary format for the cockpit
    */
    effect(() => {
      let refresh: boolean = this.automaticrefresh;
      // necessary if you come from http://localhost:4200/#/journal
      if (this.messages.length < 10) { refresh = true }
      this.updateMessageList(refresh);
    });
  }

  /*
* listen to the new incoming messages and update the message list, if wanted
  depending on the choice the user can refresh the list manually or automatically
*/
  updateMessageList = (refresh: boolean = false) => {
    this.selectedPage = this.first;
    console.log("JournalComponent effect anfang", this.first, this.selectedPage);
    if (this.messagesSig()) {
      this.temp_messages = [];
      this.objectsToSelect = this.messageService.getLabels();
      this.messagesSig().forEach((gate: IGate) => {
        gate.messages.forEach((msg: IMessage) => {
          if (msg.object.label_id)
            msg.object.label = this.objectsToSelect[msg.object.label_id];
          this.temp_messages.push(msg);
        });
      });

      if (!refresh) return;
      this.messages = [...this.temp_messages];

      /*
      * get all the existing values for the filterdropdowns sorted by the values
      */
      this.gateList = [...new Set(this.messages.map(item => item.sensor_label))].sort((a, b) => a.localeCompare(b));
      this.labelList = [...new Set(this.messages.map(item => item.object.label))].sort((a, b) => a.localeCompare(b));
      this.lpnList = [...new Set(this.messages.map(item => item.lpn))].sort((a, b) => a.localeCompare(b));
      this.debug && console.log(this.gateList, this.labelList);
    }
  }

  /*
* first messages to show, depending on the selected page and nuber of messages per page
*/
  setFirst() {
    this.first = this.selectedPage;
    console.log("setFirst", this.first, this.selectedPage);
  }

  /*
* route to gate and selected message, only from here you can additionally select and show a message which is not active
*/
  gotoMessage(msg: IMessage) {
    this.messageService.setSelectedMessage(msg);
    this.messageService.prepareMessages();
    this.router.navigateByUrl(`gate/${msg.sensor_label}`);
  }

  /*
    depending on the choice the messagelist is refreshed automatically or not on each incoming message
*/
  toggleAutomaticRefreshing() {
    this.automaticrefresh = !this.automaticrefresh;
    this.updateMessageList(this.automaticrefresh);
  }

  /*
  refresh the messagelist is refreshed manually to see new messages which have come in
*/
  tableRefresh() {
    this.updateMessageList(true);
  }

  /** clear all selected filters */
  clear() {
    this.dt.clear();
  }
}
