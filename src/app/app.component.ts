import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  ViewChild,
  inject,
} from '@angular/core';
import { IStream, IStreams } from './more/types';
import { MessageService } from './services/message.service';
import { WebSocketService } from './services/web-socket.service';

import { environment } from 'src/environments/environment';
import { ActiveMsgCntPipe } from './more/pipes/active-msg-cnt.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'CheckVideosForKI';

  messageService: MessageService = inject(MessageService);
  ws: WebSocketService = inject(WebSocketService);
  streams: Signal<IStream[]> = this.messageService.getStreamsSig();
  doculink = environment.documentationLink;

  name = environment.production ? '' : environment.name;

  // show debug messages
  debug: boolean = false;

  constructor() {
    // this.ws.doSubscribe(); // no service available
  }

  ngOnInit() {
    console.log('Appcomponent getStreamsFromDocker');
    this.getStreamsFromDocker();
    // getObjectLabels
    this.messageService.getObjectLabels();
  }

  /*
   * initialize gates and videos from docker
   *  start MqttMessageService;
   */
  async getStreamsFromDocker() {
    const response = await this.messageService.getStreamsFromDocker();
    this.debug && console.log('getStreamsFromDocker response', response);
  }

  /*
   * open/close sidenavigation
   */
  toggleSidelement(sidemenuElement: any) {
    sidemenuElement.toggle();
  }

  /*
   * reset SensorLabelSig and ObjectStepSig
   */
  reset() {
    this.messageService.setSensorLabelSig('');
    this.messageService.setObjectStepSig(-1); // reset step
  }
}
