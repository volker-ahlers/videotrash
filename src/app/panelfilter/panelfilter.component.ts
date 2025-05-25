import { FormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-panelfilter',
  standalone: true,
  imports: [TableModule, MultiSelectModule, DropdownModule, FormsModule],
  templateUrl: './panelfilter.component.html',
  styleUrl: './panelfilter.component.scss'
})
export class PanelfilterComponent {

  @Input() options: string[] = [];
  @Input() field: string = "";
  @Input() placeholder: string = "";
  @Input() max: number = 1;

  // show debug messages
  debug: boolean = true;

  ngOnInit() {
    this.debug && console.log(this.options, this.field, this.max, this.placeholder);
  }
}
