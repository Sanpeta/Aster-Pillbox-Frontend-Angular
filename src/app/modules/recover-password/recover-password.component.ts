import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
	selector: 'app-recover-password',
	standalone: true,
	imports: [IconComponent, RouterModule],
	templateUrl: './recover-password.component.html',
	styleUrl: './recover-password.component.css',
})
export class RecoverPasswordComponent {}
