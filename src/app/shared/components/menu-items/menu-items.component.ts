import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-menu-items',
	standalone: true,
	imports: [CommonModule, IconComponent],
	templateUrl: './menu-items.component.html',
	styleUrl: './menu-items.component.css',
})
export class MenuItemsComponent {
	@Input() label: string = '';
	@Input() selected = false;

	toggleExpanded() {
		this.selected = !this.selected;
	}
}
