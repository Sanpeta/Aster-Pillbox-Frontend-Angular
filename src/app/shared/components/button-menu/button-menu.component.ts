import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-button-menu',
	standalone: true,
	imports: [],
	templateUrl: './button-menu.component.html',
	styleUrl: './button-menu.component.css',
})
export class ButtonMenuComponent implements OnInit {
	@Input() description = '';
	@Input() selected = false;
	@Output() click = new EventEmitter<void>();

	constructor() {}

	ngOnInit(): void {}

	onClick() {
		this.click.emit();
	}
}
