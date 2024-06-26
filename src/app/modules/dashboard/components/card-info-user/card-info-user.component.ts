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
		image: 'https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		name: '',
		age: 0,
		blood: '',
		gender: '',
		height: '',
		weight: '',
	};

	constructor() {}
}
