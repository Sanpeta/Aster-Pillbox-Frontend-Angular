import { Component } from '@angular/core';
import { CardReminderItemComponent } from '../card-reminder-item/card-reminder-item.component';

@Component({
	selector: 'app-card-reminder',
	standalone: true,
	imports: [CardReminderItemComponent],
	templateUrl: './card-reminder.component.html',
	styleUrl: './card-reminder.component.css',
})
export class CardReminderComponent {}
