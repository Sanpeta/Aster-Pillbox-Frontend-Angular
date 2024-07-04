import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [RouterModule, ReactiveFormsModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent {
	sendMenssageForm = this.formBuilder.group({
		name: '',
		email: '',
		message: '',
	});

	constructor(private formBuilder: FormBuilder) {}

	onSubmitMenssage() {
		console.log(this.sendMenssageForm.value);
	}
}
