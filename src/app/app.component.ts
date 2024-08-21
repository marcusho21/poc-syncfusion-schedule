import {
  Component,
  effect,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AgendaService,
  DayService,
  EventSettingsModel,
  FieldModel,
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
import {
  DataManager,
  Query,
  UrlAdaptor,
  WebApiAdaptor,
} from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ScheduleModule],
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
    schedule.openEditor(this.getEventData(schedule), 'Save', true);
  }

  getEventData(schedule: ScheduleComponent) {
    const date: Date = schedule.selectedDate;
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
