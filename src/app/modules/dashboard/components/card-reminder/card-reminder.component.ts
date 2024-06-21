import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { CardReminderItemComponent } from '../card-reminder-item/card-reminder-item.component';

@Component({
	selector: 'app-card-reminder',
	standalone: true,
	imports: [CardReminderItemComponent, IconComponent, RouterModule],
	templateUrl: './card-reminder.component.html',
	styleUrl: './card-reminder.component.css',
})
export class CardReminderComponent {}
