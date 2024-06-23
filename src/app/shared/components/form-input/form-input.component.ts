import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-form-input',
	standalone: true,
	imports: [ReactiveFormsModule],
	template: `<div>
		<div>
			<label
				for="email"
				class="block text-sm font-semibold leading-6 text-gray-900"
				>{{ label }}</label
			>
		</div>
		<div class="mt-2">
			<input
				[id]="id"
				[name]="id"
				[type]="type"
				autocomplete="email"
				[placeholder]="placeholder"
				[formControl]="formControl"
				[value]="value"
				[required]="required"
				class="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:to-blue-700 sm:text-sm sm:leading-5"
			/>
		</div>
	</div> `,
})
export class FormInputComponent {
	@Input() id: string = '';
	@Input() label: string = '';
	@Input() type: string = 'text';
	@Input() value: string = '';
	@Input() placeholder: string = '';
	@Input() required: boolean = false;
	@Input() formControl!: FormControl;

	constructor(private parentFormGroup: FormGroup) {}
}
