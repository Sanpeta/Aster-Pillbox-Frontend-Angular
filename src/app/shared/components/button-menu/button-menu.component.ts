// button-menu.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-button-menu',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button-menu.component.html',
	styleUrl: './button-menu.component.css',
})
export class ButtonMenuComponent {
	@Input() description = '';
	@Input() selected = false;
	@Input() collapsed = false;
	@Input() classes = '';

	getButtonClasses(): string {
		return `${this.selected ? 'selected' : ''} ${
			this.collapsed ? 'collapsed' : ''
		} ${this.classes}`;
	}
}
