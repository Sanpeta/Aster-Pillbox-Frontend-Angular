import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetCaseResponse } from '../../../../models/interfaces/case/GetCase';
import { CaseService } from '../../../../services/case/case.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { MedicineCasePillboxComponent } from '../../../../shared/components/medicine-case-pillbox/medicine-case-pillbox.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';

@Component({
	selector: 'app-card-medication-pillbox',
	standalone: true,
	imports: [
		SelectComponent,
		MedicineCasePillboxComponent,
		IconComponent,
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
	],
	templateUrl: './card-medication-pillbox.component.html',
	styleUrl: './card-medication-pillbox.component.css',
})
export class CardMedicationPillboxComponent implements OnInit {
	private destroy$ = new Subject<void>();
	public listCase: GetCaseResponse[] = [];
	public columns: number = 0;
	public rows: number = 0;

	constructor(
		private caseService: CaseService,
		private formBuilder: FormBuilder
	) {}

	selectForm = this.formBuilder.group({
		pillbox: [-1, [Validators.required]],
	});

	ngOnInit(): void {
		this.caseService
			.getCasesByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (res) => {
					this.listCase = res;
					console.log(this.listCase);
				},
				error: (err) => {
					console.log(err);
				},
				complete: () => {
					console.log('complete');
				},
			});

		this.selectForm
			.get('pillbox')!
			.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((item) => {
				this.columns = this.listCase[item!].column_size;
				this.rows = this.listCase[item!].row_size;
			});
	}

	createRange(number: number) {
		const items: number[] = [];
		for (let i = 0; i < number; i++) {
			items.push(i);
		}
		return items;
	}
}
