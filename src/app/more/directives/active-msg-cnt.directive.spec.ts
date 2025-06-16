import { ActiveMsgCntDirective } from './active-msg-cnt.directive';

describe('ActiveMsgCntDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    } as any;
    const directive = new ActiveMsgCntDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
