import { Component, Signal, ViewChild, effect, inject, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GateComponent } from '../gates/gate.component';
import { MessageComponent } from '../messages/message.component';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message.service';
import { IMessage } from '../more/types';

@Component({
    selector: 'app-gate-view',
    imports: [CommonModule, GateComponent, MessageComponent],
    templateUrl: './gate-view.component.html',
    styleUrl: './gate-view.component.scss'
})
export class GateViewComponent implements AfterViewInit {

  @ViewChild('activeMessagesList') activeMessagesList!: ElementRef;

  messageService: MessageService = inject(MessageService);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);

  sensor_label: string = "";

  // show debug messages
  debug: boolean = false;

  /*
  * get filtered messages for the gate
  */
  activeMessages: Signal<IMessage[]> = this.messageService.getMessagesPerGateSig();

  ngOnInit() {
    /*
    * listen to routing params
    * set the sensor_label
    */
    this.activeRoute.params.subscribe((params) => {
      this.sensor_label = params['sensor_label'];
      this.messageService.setSensorLabelSig(params['sensor_label']);
      this.debug && console.log("initgateview", this.sensor_label);
    });
  }

  ngAfterViewInit() {
    this.scrollToSelectedItem();
  }

  /*
* when message is selected from the overviev, 
* scroll to the selected message automatically
*/
  scrollToSelectedItem() {
    const elem = this.activeMessagesList.nativeElement as HTMLElement;
    const selected = elem.querySelector('.selected') as HTMLElement;
    if (selected) {
      elem.scrollTop = selected.offsetTop - elem.offsetTop;
    }
    console.log(elem, selected, elem.scrollTop);
  }
}
