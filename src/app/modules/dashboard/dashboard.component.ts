import { AsyncPipe } from '@angular/common';
import {
	Component,
	ComponentFactoryResolver,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { UserInfo } from '../../models/interfaces/dashboard/UserInfo';
import { GetUserResponse } from '../../models/interfaces/user/GetUser';
import { UserService } from '../../services/user/user.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
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
		DialogComponent,
	],
})
export class DashboardComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	public showLoader = false;
	public userInfo: UserInfo = {
		image: 'https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		name: '',
		age: 0,
		blood: '',
		gender: '',
		height: '',
		weight: '',
	};

	@ViewChild('toastContainer', { read: ViewContainerRef })
	toast!: ViewContainerRef;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private userService: UserService,
		private cookie: CookieService,
		private router: Router
	) {}

	ngOnInit() {
		this.showLoader = true;
		const ACCOUNT_ID = this.cookie.get('ACCOUNT_ID');

		this.userService
			.getUserByAccountID(parseInt(ACCOUNT_ID))
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (user) => {
					var firstName = user.name.split(' ')[0];
					this.populateUserInfo(user);
					if (this.cookie.check('USER_ID')) {
						this.cookie.delete('USER_ID');
						this.cookie.set('USER_ID', user.user_id.toString());
					} else {
						this.cookie.set('USER_ID', user.user_id.toString());
					}
				},
				complete: () => {
					this.showLoader = false;
				},
				error: (error) => {
					switch (error.status) {
						case 401:
							this.showToast('Não autorizado', 'error');
							break;
						case 404:
							this.openDialog(
								'Complete seu Perfil',
								'Olá! Para aproveitar ao máximo os recursos do nosso aplicativo e garantir uma experiência personalizada, precisamos de algumas informações adicionais sobre você. Por favor, reserve um momento para completar seu perfil.',
								'Continuar',
								'',
								() => {
									this.router.navigate(['/dashboard/perfil']);
								}
							);
							break;
						case 500:
							this.showToast('Erro no servidor', 'error');
							break;
						default:
							this.showToast('Erro ao carregar usuário', 'error');
							break;
					}
				},
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private populateUserInfo(user: GetUserResponse) {
		this.userInfo.name = user.name;
		this.userInfo.age = parseInt(user.age, 10); // Converter para number se necessário
		this.userInfo.gender = user.genre;
		this.userInfo.blood = user.blood_type;
		this.userInfo.height = user.height.toString(); // Converter para string se necessário
		this.userInfo.weight = user.weight.toString(); // Converter para string se necessário
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

	openDialog(
		title: string,
		mensage: string,
		buttonTextConfirm: string,
		buttonTextClose?: any | undefined,
		funcConfirmButton?: any | null
	): void {
		const componentRef =
			this.dialogContainer.createComponent(DialogComponent);

		componentRef.instance.data = {
			title: title,
			mensage: mensage,
			buttonTextConfirm: buttonTextConfirm,
			buttonTextClose: buttonTextClose,
		};

		componentRef.instance.close.subscribe(() => {
			this.dialogContainer.clear(); // Fecha o diálogo
		});

		componentRef.instance.confirm.subscribe(() => {
			// Ação a ser executada se o usuário clicar em "Continuar"
			if (funcConfirmButton) {
				funcConfirmButton();
			}
		});
	}
}
