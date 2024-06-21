import { Component } from '@angular/core';
import { CalendarWeekItemComponent } from '../calendar-week-item/calendar-week-item.component';

@Component({
	selector: 'app-calendar-week',
	standalone: true,
	imports: [CalendarWeekItemComponent],
	templateUrl: './calendar-week.component.html',
	styleUrl: './calendar-week.component.css',
})
export class CalendarWeekComponent {}
