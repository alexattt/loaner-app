import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { UsersService } from './services/users.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserPageComponent } from './components/user-page/user-page.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  declarations: [AppComponent, UserPageComponent, StatisticsComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        { path: '', redirectTo: '/my-data', pathMatch: 'full' },
        { path: 'my-data', component: UserPageComponent },
        { path: 'statistics', component: StatisticsComponent },
      ],
      { onSameUrlNavigation: 'reload' }
    ),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CardModule,
    DropdownModule,
    TabViewModule,
    FieldsetModule,
    TableModule,
    ButtonModule,
    ConfirmPopupModule,
    ToastModule,
    InputNumberModule,
    DividerModule,
  ],
  providers: [UsersService, ConfirmationService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
