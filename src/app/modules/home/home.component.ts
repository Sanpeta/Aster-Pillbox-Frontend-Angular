import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [RouterModule, ReactiveFormsModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent {
	@ViewChild('homeSection') homeSection: ElementRef = {} as ElementRef;
	@ViewChild('functionsSection') functionsSection: ElementRef =
		{} as ElementRef;
	@ViewChild('plansSection') plansSection: ElementRef = {} as ElementRef;
	@ViewChild('contactUsSection') contactUsSection: ElementRef =
		{} as ElementRef;

	sendMenssageForm = this.formBuilder.group({
		name: '',
		email: '',
		message: '',
	});

	constructor(private formBuilder: FormBuilder, private router: Router) {}

	onSubmitMenssage() {
		console.log(this.sendMenssageForm.value);
	}

	scrollToSection(sectionId: string) {
		switch (sectionId) {
			case 'home':
				this.homeSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'functions':
				this.functionsSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'plans':
				this.plansSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'contact-us':
				this.contactUsSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			default:
				break;
		}
	}
}
