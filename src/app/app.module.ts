import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';

import { BgSwitcherComponent } from './background-switcher/bg-switcher.component';
import { VideoComponent } from "./video/video.component";
import { OverviewComponent } from './overview/overview.component';
import { MessageComponent } from './messages/message.component';
import { GateComponent } from './gates/gate.component';
import { JournalComponent } from './journal/journal.component';

import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './more/CustomRouteReuseStrategy';
// import { ActiveMsgCntPipe } from './more/pipes/active-msg-cnt.pipe';
import { ActiveMsgCntDirective } from './more/directives/active-msg-cnt.directive';

export const connection: IMqttServiceOptions = {
    connectOnCreate: false
}

@NgModule({
    declarations: [
        AppComponent,
        BgSwitcherComponent,
        OverviewComponent
    ],
    bootstrap: [AppComponent], imports: [
        // ActiveMsgCntPipe,
        ActiveMsgCntDirective,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        // Required to see a date picker pop up
        MatDatepickerModule,
        MatNativeDateModule,
        // snack bar
        MatSnackBarModule,
        MatTreeModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatSelectModule,
        MatCardModule,
        MatExpansionModule,
        MatTabsModule,
        MatGridListModule,
        VideoComponent,
        MessageComponent,
        GateComponent,
        MqttModule.forRoot(connection),
        JournalComponent], providers: [
            { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
            provideHttpClient(withInterceptorsFromDi())
        ]
})
export class AppModule { }
