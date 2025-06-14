import {
  Component,
  Input,
  Signal,
  ViewChild,
  effect,
  inject,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../services/message.service';
import { IMessage, IStream } from '../more/types';
import { environment } from '../../environments/environment';
import html2canvas from 'html2canvas';
import Hls from 'hls.js';

@Component({
    selector: 'app-video',
    imports: [MatButtonModule],
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent {
  @ViewChild('hlsvideo', { static: true }) hlsvideo!: any;

  messageService: MessageService = inject(MessageService);

  @Input() url: string = '';
  @Input() codec: string = 'video/mp4';

  // gate or cockpit view
  @Input() view: string = '';

  // sensor label for cockpit view
  @Input() sensor_label: string = '';

  streams: Signal<IStream[]> = this.messageService.getStreamsSig();
  sensorLabel: Signal<string> = this.messageService.getSensorLabelSig();
  selectedMessage: Signal<IMessage | null> =
    this.messageService.getSelectedMessageSig();

  // set currenttime
  currenttime: number = 0;

  //timeout for video player
  timeouttime: number = 300;
  // show debug messages
  debug: boolean = false;

  constructor() {
    /*
    * effect is used to react to changes in the sensorLabel or selected message
    and updates the url for the video player
    */
    effect(() => {
      if (this.view !== 'gate') {
        return;
      }

      console.warn(
        'effect',
        this.constructor.name,
        this.view,
        this.sensor_label
      );

      if (this.selectedMessage()?.sensor_label !== '') {
        this.debug &&
          console.log(
            'this.selectedMessage()',
            this.selectedMessage()?.sensor_label,
            this.sensor_label
          );
        if (this.selectedMessage()?.sensor_label === this.sensor_label) {
          const time = this.selectedMessage()?.frame_id ?? 0;
          if (time) {
            this.jumpToTime(time / 25);
          }
        }
      }
    });
  }

  ngOnInit() {
    this.debug && console.log('init video', this.sensor_label);
    this.setUrl(this.sensor_label);
    this.sethlsSupport();
  }

  /*
   * sets the url for the video player from the config
   * selects the url for cockpit- or gate-view
   */
  setUrl(label: string) {
    const stream = this.streams().filter((stream) => stream.name === label)[0];
    if (stream !== undefined) {
      this.debug && console.log(label, stream.name, stream);
      this.url =
        this.view === 'cockpit'
          ? stream.user_stream_dir_raw
          : stream.user_stream_dir_detection;
    }
  }

  /*
   * ngAfterViewInit is necessary to initialize the video player as a viewchild
   * initializes the hls.js player
   * sets some default values for the video player
   */
  ngAfterViewInit() {
    this.debug &&
      console.log(
        'init video ngAfterViewInit',
        this.hlsvideo,
        this.hlsvideo.nativeElement
      );

    this.hlsvideo.nativeElement.muted = true;
    this.hlsvideo.nativeElement.autoplay = true;
    this.hlsvideo.nativeElement.loop = false;
    // this.sethlsSupport();
  }

  /*
   * initializes the hls.js player
   */
  sethlsSupport() {
    this.debug && console.log('HLS', this.url);
    if (this.url.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        var hls = new Hls();
        this.debug && console.log('isSupported');
        hls.loadSource(this.url);
        if (this.hlsvideo) {
          hls.attachMedia(this.hlsvideo.nativeElement);
          this.debug && console.log('attachMedia done');
        }
      } else if (this.hlsvideo.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('notSupported');
        this.hlsvideo.src = this.url;
      }
    }
  }

  /*
   * to avoid conflicts uit checks if the video is paused or ended
   * and sets a timeout to play the video
   */
  playVideo() {
    console.log(
      'this.hlsvideo.nativeElement.paused',
      this.hlsvideo.nativeElement.paused
    );
    console.log(
      'this.hlsvideo.nativeElement.ended',
      this.hlsvideo.nativeElement.ended
    );
    if (
      this.hlsvideo?.nativeElement &&
      (this.hlsvideo.nativeElement.paused || this.hlsvideo.nativeElement.ended)
    ) {
      setTimeout(() => {
        this.sethlsSupport();
        this.currenttime = 0;

        this.hlsvideo.nativeElement.play();
      }, this.timeouttime);
    }
  }

  /*
   * should be used to jump to a specific time in the video
   */
  jumpToTime(time: number) {
    this.currenttime = time;
    setTimeout(() => {
      this.debug &&
        console.log(
          'label',
          this.selectedMessage()?.sensor_label,
          this.sensor_label
        );
      this.hlsvideo.nativeElement.currentTime = time;
      console.log('currentTime', this.hlsvideo.nativeElement.currentTime, time);
      this.hlsvideo.nativeElement.pause();
    }, 100 + this.timeouttime);
  }

  /*
   * should take the movie to the life point means the current frame
   * test if this works
   */
  resume() {
    //TODO check
    if (environment.production) {
      this.hlsvideo.nativeElement.load();
      this.playVideo();
    }
  }

  ngOnDestroy() {
    this.debug &&
      console.warn(
        'destroyed',
        this.constructor.name,
        this.view,
        this.sensor_label
      );
  }
}
