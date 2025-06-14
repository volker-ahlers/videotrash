import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-switcher',
    templateUrl: './bg-switcher.component.html',
    styleUrls: ['./bg-switcher.component.scss'],
    standalone: false
})
export class BgSwitcherComponent {

  @Input() labelPosition: 'before' | 'after' | undefined;
  darkmode: boolean = false;

  /*
* init mode
which is stored in the sessionstorage
*/
  ngOnInit() {
    this.darkmode = sessionStorage.getItem('darkmode') === 'true';
    this.switchMode(this.darkmode);
  }

  /*
  * toggle styles and (dark)mode
  which are defined in the rweStyle.scss
  */
  toggleDarkMode() {
    try {
      this.darkmode = !this.darkmode;
      this.switchMode(this.darkmode);
    }
    catch (e: any) {
      console.log(e.message);
    }
  }

  /*
* have a look into rweStyle.scss
  and save it to the sessionstorage
*/
  switchMode(dark: boolean) {
    if (dark) {
      document.querySelector('body')?.classList.add('dark');
    } else {
      document.querySelector('body')?.classList.remove('dark');
    }
    sessionStorage.setItem('darkmode', dark.toString());
  }
}
