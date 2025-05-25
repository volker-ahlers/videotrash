import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CockpitComponent } from './cockpit/cockpit.component';
import { JournalComponent } from './journal/journal.component';
import { GateViewComponent } from './gate-view/gate-view.component'

const routes: Routes = [

  { path: 'gate/:sensor_label', component: GateViewComponent },
  { path: '', component: CockpitComponent, pathMatch: 'full' },
  { path: 'journal', component: JournalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }


