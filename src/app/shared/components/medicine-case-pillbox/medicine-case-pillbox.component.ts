import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-medicine-case-pillbox',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './medicine-case-pillbox.component.html',
	styleUrl: './medicine-case-pillbox.component.css',
})
export class MedicineCasePillboxComponent implements OnInit {
	@Input() titleLabel: string = '';
	@Input() columns: number = 1;
	@Input() rows: number = 1;

	selectedItems: number[] = [];

	ngOnInit() {}

	createRange(number: number) {
		const items: number[] = [];
		for (let i = 0; i < number; i++) {
			items.push(i);
		}
		return items;
	}

	toggleSelection(index: number) {
		this.selectedItems = this.selectedItems.includes(index)
			? this.selectedItems.filter((i) => i !== index)
			: [...this.selectedItems, index];
	}
}
