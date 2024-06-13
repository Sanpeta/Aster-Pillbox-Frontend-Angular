import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon',
	standalone: true,
	imports: [],
	templateUrl: 'icon.component.html',
})
export class IconComponent {
	@Input() src: string = '';
	@Input() alt: string = '';
	@Input() classes: string = '';
}
