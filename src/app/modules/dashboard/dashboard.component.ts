import { AsyncPipe } from '@angular/common';
import {
	Component,
	ComponentFactoryResolver,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { ListMedicationsComponent } from '../../shared/components/list-medications/list-medications.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { CalendarWeekComponent } from './components/calendar-week/calendar-week.component';
import { CardInfoUserComponent } from './components/card-info-user/card-info-user.component';
import { CardMedicationPillboxComponent } from './components/card-medication-pillbox/card-medication-pillbox.component';
import { CardReminderComponent } from './components/card-reminder/card-reminder.component';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
	standalone: true,
	imports: [
		AsyncPipe,
		ToastComponent,
		CardInfoUserComponent,
		CardReminderComponent,
		CalendarWeekComponent,
		CardMedicationPillboxComponent,
		ListMedicationsComponent,
	],
})
export class DashboardComponent {
	@ViewChild('toastContainer', { read: ViewContainerRef })
	toast!: ViewContainerRef;

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

	ngOnInit() {}

	ngAfterViewInit() {
		// Use ngAfterViewInit instead of ngOnInit
		this.showToast('Bem-vindo', 'success');
	}

	showToast(
		mensagem: string,
		type: 'success' | 'error' | 'info' | 'warning' = 'success'
	) {
		const componentFactory =
			this.componentFactoryResolver.resolveComponentFactory(
				ToastComponent
			);
		this.toast.clear(); // Limpa o container antes de criar um novo toast
		const componentRef = this.toast.createComponent(componentFactory);
		componentRef.instance.mensage = mensagem;
		componentRef.instance.type = type;
		componentRef.instance.closeToast.subscribe(() => {
			componentRef.destroy();
		});
	}
}
