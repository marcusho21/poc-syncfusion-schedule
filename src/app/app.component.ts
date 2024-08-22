import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, viewChild, ViewEncapsulation } from '@angular/core';
import {
  ActionEventArgs,
  AgendaService,
  DayService,
  EventSettingsModel,
  MonthAgendaService,
  MonthService,
  ScheduleComponent,
  ScheduleModule,
  TimelineMonthService,
  TimelineViewsService,
  View,
  WeekService,
  WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
import { DataManager, UrlAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { extend } from '@syncfusion/ej2-base';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ScheduleModule, JsonPipe, NgIf],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
    TimelineViewsService,
    TimelineMonthService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  currentView: View = 'Agenda';
  readonly views: View[] = ['Agenda', 'Month', 'Day'];
  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  private dataManager = new DataManager({
    url: 'http://localhost:3000/schedules',
    adaptor: new UrlAdaptor(),
    crossDomain: true,
    insertUrl: 'http://localhost:3000/schedules/add',
  });
  eventSettings: EventSettingsModel = {
    dataSource: this.dataManager,
    // query: new Query().addParams('hello', 'world'),
  };

  scheduleComponent = viewChild(ScheduleComponent);

  constructor() {}

  ngOnInit() {
    this.removeLicenseWarning();

    // this.dataManager.executeQuery(new Query().take(8)).then((res) => {
    //   console.log(res);
    // });
  }

  // ! Workaround for the license warning to unblock the top bar for POC. DO NOT USE IN PRODUCTION.
  removeLicenseWarning() {
    const licenseWarning = document.querySelector('div:has(img, span)');
    licenseWarning?.remove();
  }

  onAddEvent() {
    const schedule = this.scheduleComponent();
    if (!schedule) return;
    schedule.openEditor(this.getEventData(schedule), 'Add', true);
  }

  // Intercepts all event actions and other unimportant events when the user interacts with the scheduler and the component loads
  onActionBegin(args: ActionEventArgs) {
    console.log(args);
  }

  // emits when any action is completed successfully
  onActionComplete(args: ActionEventArgs) {
    console.log(args);
    if (args.requestType === 'eventCreated') {
      this.scheduleComponent()?.refreshEvents();
    }
  }

  // actionFailure emits when any event actions fail
  // error is type unknown because the error object is not documented in the Syncfusion API and it's changed based on the error backend responses
  // seems like action is always 'actionFailure' because it's the only action that emits this event
  onActionFailure(args: { error: unknown; name: 'actionFailure' }) {
    console.log(args);
  }

  // how to construct an event object to add to the scheduler
  getEventData(schedule: ScheduleComponent) {
    const date: Date = schedule.selectedDate;

    // these have to be upper case for it to work
    return {
      Id: schedule.getEventMaxID(),
      Subject: '',
      StartTime: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        new Date().getHours(),
        0,
        0
      ),
      EndTime: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        new Date().getHours() + 1,
        0,
        0
      ),
      Location: '',
      Description: '',
      IsAllDay: false,
      CalendarId: 1,
    };
  }
}
