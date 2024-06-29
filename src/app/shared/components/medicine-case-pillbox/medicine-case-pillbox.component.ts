import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

	@Output() selectedItemChange = new EventEmitter<number>();
	selectedIndex: number | null = null;

	ngOnInit() {}

	createRange(number: number) {
		const items: number[] = [];
		for (let i = 0; i < number; i++) {
			items.push(i);
		}
		return items;
	}

	toggleSelection(index: number) {
		if (this.selectedIndex === index) {
			this.selectedIndex = null; // Deseleciona se clicar novamente no mesmo item
		} else {
			this.selectedIndex = index;
			this.selectedItemChange.emit(index); // Emite o índice do item selecionado
		}
	}
}
