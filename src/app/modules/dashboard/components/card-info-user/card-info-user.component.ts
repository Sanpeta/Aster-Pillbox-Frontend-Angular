import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserInfo } from '../../../../models/interfaces/dashboard/UserInfo';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
	selector: 'app-card-info-user',
	standalone: true,
	imports: [IconComponent, RouterModule],
	templateUrl: './card-info-user.component.html',
	styleUrl: './card-info-user.component.css',
})
export class CardInfoUserComponent {
	@Input() user: UserInfo = {
		image_url: '',
		name: '',
		age: 0,
		blood: '',
		gender: '',
		height: '',
		weight: '',
	};

	constructor() {}
}
