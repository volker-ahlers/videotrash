import { Pipe, PipeTransform } from '@angular/core';
import { inject } from '@angular/core';
import { MessageService } from '../../services/message.service';

/** not in use but left as example */
@Pipe({
  name: 'activeMsgCnt',
  standalone: true,
  pure: false
})
export class ActiveMsgCntPipe implements PipeTransform {
  messageService: MessageService = inject(MessageService);
  transform(value: string, ...args: unknown[]): unknown {
    console.log(value);
    const val = this.messageService.getActiveMessagesCnt(value, "pipe");
    // console.log(val);
    return val ?? 0;
  }

}
