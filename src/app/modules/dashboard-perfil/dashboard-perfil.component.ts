import {
	Component,
	ComponentFactoryResolver,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Subject, takeUntil } from 'rxjs';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { CreateUserRequest } from '../../models/interfaces/user/CreateUser';
import { UpdateUserRequest } from '../../models/interfaces/user/UpdateUser';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { SidenavDashboardComponent } from '../../shared/components/sidenav-dashboard/sidenav-dashboard.component';
import { SidenavTitleDashboardComponent } from '../../shared/components/sidenav-title-dashboard/sidenav-title-dashboard.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToolbarDashboardComponent } from '../../shared/components/toolbar-dashboard/toolbar-dashboard.component';
import { UserService } from './../../services/user/user.service';

@Component({
	selector: 'app-dashboard-perfil',
	standalone: true,
	imports: [
		ToolbarDashboardComponent,
		SidenavTitleDashboardComponent,
		SidenavDashboardComponent,
		DashboardLayoutComponent,
		ReactiveFormsModule,
		FormInputComponent,
		RouterModule,
		NgxMaskDirective,
	],
	templateUrl: './dashboard-perfil.component.html',
	styleUrl: './dashboard-perfil.component.css',
	providers: [provideNgxMask()],
})
export class DashboardPerfilComponent implements OnInit, OnDestroy {
	public loading = false;
	public createNewUser = true;

	private destroy$ = new Subject<void>();
	private userCreateRequest: CreateUserRequest = {
		account_id: 0,
		age: '',
		blood_type: '',
		cpf_or_id_number: '',
		date_of_birth: '',
		genre: '',
		height: '',
		name: '',
		need_a_caretaker: false,
		phone_number: '',
		screen_for_elder: false,
		weight: '',
		image_url: '',
	};
	private ACCOUNT_ID = 0;
	private ACCOUNT_EMAIL = '';

	@ViewChild('toastContainer', { read: ViewContainerRef })
	toast!: ViewContainerRef;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private formBuilder: FormBuilder,
		private userService: UserService,
		private cookie: CookieService,
		private router: Router
	) {}

	userForm = this.formBuilder.group({
		name: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
		genre: ['', [Validators.required]],
		need_a_caretaker: [false, [Validators.required]],
		height: ['', [Validators.required]],
		weight: ['', [Validators.required]],
		date_of_birth: ['', [Validators.required]],
		cpf_or_id_number: ['', [Validators.required]],
		phone_number: ['', [Validators.required]],
		blood_type: ['', [Validators.required]],
		screen_for_elder: [false, [Validators.required]],
	});

	ngOnInit(): void {
		this.ACCOUNT_ID = parseInt(this.cookie.get('ACCOUNT_ID'));
		this.ACCOUNT_EMAIL = this.cookie.get('ACCOUNT_EMAIL');
		this.loading = true;
		this.userForm.patchValue({
			email: this.ACCOUNT_EMAIL,
		});

		this.userService
			.getUserByAccountID(this.ACCOUNT_ID)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					if (response) {
						// Converter para Date e depois para o formato yyyy-MM-dd
						const dateOfBirthDate = new Date(
							response.date_of_birth
						);
						const formattedDateOfBirth = dateOfBirthDate
							.toISOString()
							.slice(0, 10); // yyyy-MM-dd

						this.userForm.patchValue({
							name: response.name,
							genre: response.genre,
							need_a_caretaker: response.need_a_caretaker,
							height: response.height,
							weight: response.weight,
							date_of_birth: formattedDateOfBirth,
							cpf_or_id_number: response.cpf_or_id_number,
							phone_number: response.phone_number,
							blood_type: response.blood_type,
							screen_for_elder: response.screen_for_elder,
						});
						this.loading = false;
						this.createNewUser = false;
						this.toast.clear();
						this.showToast('Informações carregadas com sucesso!');
					}
				},
				complete: () => {
					this.loading = false;
				},
				error: (error) => {
					console.log(error);
					this.loading = false;
					this.toast.clear();
					this.showToast('Favor preencher as informações!', 'info');
				},
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private convertDateFormat(date: string): string {
		const [year, month, day] = date.split('-');
		return `${day}-${month}-${year}`;
	}

	private convertStringToDate(dateString: string): Date {
		const [year, month, day] = dateString.split('-');
		return new Date(+year, +month - 1, +day);
	}

	private takeAge(date: string): string {
		const [year, month, day] = date.split('-');
		const currentYear = new Date().getFullYear();
		const age = currentYear - parseInt(year);
		return age.toString();
	}

	onSubmitUserForm(): void {
		this.loading = true;

		if (this.userForm.valid && this.userForm.value) {
			console.log(this.createNewUser);
			const formValue = this.userForm.value;

			this.userCreateRequest = {
				account_id: parseInt(this.cookie.get('ACCOUNT_ID')),
				name: formValue.name!,
				age: this.takeAge(formValue.date_of_birth!),
				genre: formValue.genre!,
				need_a_caretaker: formValue.need_a_caretaker ?? false,
				height: formValue.height!,
				weight: formValue.weight!,
				date_of_birth: this.convertDateFormat(formValue.date_of_birth!),
				cpf_or_id_number: formValue.cpf_or_id_number!,
				phone_number: formValue.phone_number!,
				blood_type: formValue.blood_type!,
				screen_for_elder: formValue.screen_for_elder ?? false,
				image_url: '',
			};

			if (this.createNewUser) {
				this.userService
					.createUser(this.userCreateRequest)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
						next: (response) => {
							if (response) {
								console.log(response);
								this.userForm.reset();
								this.loading = false;
								this.toast.clear();
								this.showToast(
									'Usuário criado com sucesso!',
									'success'
								);
							}
						},
						complete: () => {
							this.loading = false;
						},
						error: (error) => {
							console.log(error);
							this.toast.clear();
							this.showToast(
								'Erro ao criar usuário. Tente novamente mais tarde.',
								'error'
							);
							this.loading = false;
						},
					});
			} else {
				var userUpdate: UpdateUserRequest = {
					id: parseInt(this.cookie.get('USER_ID')),
					name: formValue.name!,
					age: this.takeAge(formValue.date_of_birth!),
					genre: formValue.genre!,
					need_a_caretaker: formValue.need_a_caretaker ?? false,
					height: formValue.height!,
					weight: formValue.weight!,
					date_of_birth: this.convertDateFormat(
						formValue.date_of_birth!
					),
					cpf_or_id_number: formValue.cpf_or_id_number!,
					phone_number: formValue.phone_number!,
					blood_type: formValue.blood_type!,
					screen_for_elder: formValue.screen_for_elder ?? false,
					image_url: '',
				};

				this.userService
					.updateUser(userUpdate)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
						next: (response) => {
							if (response) {
								console.log(response);
								this.loading = false;
								this.toast.clear();
								this.showToast(
									'Informações atualizados com sucesso!',
									'success'
								);
							}
						},
						complete: () => {
							this.loading = false;
						},
						error: (error) => {
							console.log(error);
							this.toast.clear();
							this.showToast(
								'Erro ao atualizar. Tente novamente mais tarde.',
								'error'
							);
							this.loading = false;
						},
					});
			}
		} else {
			this.loading = false;
			this.toast.clear();
			this.showToast(
				'Preencha todos os campos antes de continuar.',
				'error'
			);
		}
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
