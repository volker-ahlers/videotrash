import { Directive, ElementRef, Input, OnInit, Signal, effect } from '@angular/core';
import { inject } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Directive({
  selector: '[appActiveMsgCnt]',
  standalone: true
})
export class ActiveMsgCntDirective implements OnInit {
  messageService: MessageService = inject(MessageService);
  @Input() appActiveMsgCnt: string = "";

  /** show the number of messages dynamicly on the tabs and sidenavigation */
  constructor(private eleRef: ElementRef) {
    effect(() => {
      if (this.appActiveMsgCnt === "") return;
      const elem = this.eleRef.nativeElement;
      const val = this.messageService.getActiveMessagesCnt(this.appActiveMsgCnt, "directive");
      if (val) {
        elem.classList.add('highlighted');
      } else {
        elem.classList.remove('highlighted');
      }
      const sub = elem.querySelector('sub');
      sub.innerHTML = val;
    });
  }

  ngOnInit() { }
}
