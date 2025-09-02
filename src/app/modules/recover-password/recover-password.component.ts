import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '../../services/account/account.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { FormUtils } from '../../shared/constants';

@Component({
	selector: 'app-recover-password',
	standalone: true,
	imports: [
		IconComponent,
		RouterModule,
		ReactiveFormsModule,
		LoaderComponent,
	],
	templateUrl: './recover-password.component.html',
	styleUrl: './recover-password.component.css',
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	public isLoading = false;

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	public readonly resetPasswordForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly accountService: AccountService
	) {}

	ngOnInit(): void {
		this.resetPasswordForm.reset();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public onSubmit(): void {
		if (this.resetPasswordForm.invalid) {
			this.handleValidationError();
			return;
		}

		const email = this.resetPasswordForm.value.email as string;
		this.setLoadingState(true);

		this.accountService
			.createTokenResetPassword(email)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => this.handleSuccess(),
				error: (error) => this.handleError(error),
			});
	}

	private handleSuccess(): void {
		this.setLoadingState(false);
		this.showSuccessDialog();
	}

	private handleError(error: any): void {
		console.error('Password reset error:', error);
		this.setLoadingState(false);

		const errorMessages = {
			400: {
				title: 'Dados inválidos',
				message: 'Verifique o email informado e tente novamente.',
			},
			404: {
				title: 'Email não encontrado',
				message:
					'Este email não está cadastrado em nossa base de dados.',
			},
			429: {
				title: 'Muitas tentativas',
				message: 'Aguarde alguns minutos antes de tentar novamente.',
			},
			default: {
				title: 'Erro no sistema',
				message:
					'Não foi possível processar sua solicitação. Tente novamente.',
			},
		};

		const errorInfo =
			errorMessages[error.status as keyof typeof errorMessages] ||
			errorMessages.default;
		this.showErrorDialog(errorInfo.title, errorInfo.message);
	}

	private handleValidationError(): void {
		const emailControl = this.resetPasswordForm.get('email');

		if (emailControl?.hasError('required')) {
			this.showErrorDialog(
				'Email obrigatório',
				'Digite seu email para recuperar a senha.'
			);
		} else if (emailControl?.hasError('email')) {
			this.showErrorDialog(
				'Email inválido',
				'Digite um email válido para continuar.'
			);
		}
	}

	private showSuccessDialog(): void {
		this.openDialog(
			'Email enviado com sucesso!',
			'Verifique sua caixa de entrada e siga as instruções para redefinir sua senha. Se não encontrar o email, verifique também a pasta de spam.',
			'Entendi',
			undefined,
			() => {
				this.resetPasswordForm.reset();
			}
		);
	}

	private showErrorDialog(title: string, message: string): void {
		this.openDialog(title, message, 'Tentar novamente');
	}

	private setLoadingState(loading: boolean): void {
		this.isLoading = loading;
	}

	private openDialog(
		title: string,
		message: string,
		confirmText: string,
		cancelText?: string,
		onConfirm?: () => void
	): void {
		const componentRef =
			this.dialogContainer.createComponent(DialogComponent);

		componentRef.instance.data = {
			title,
			mensage: message,
			buttonTextConfirm: confirmText,
			buttonTextClose: cancelText || 'Fechar',
		};

		componentRef.instance.close.subscribe(() => {
			this.dialogContainer.clear();
		});

		componentRef.instance.confirm.subscribe(() => {
			if (onConfirm) {
				onConfirm();
			}
			this.dialogContainer.clear();
		});
	}

	// Métodos públicos para o template
	public hasEmailError(): boolean {
		return FormUtils.hasError(this.resetPasswordForm.get('email'));
	}

	public getEmailErrorMessage(): string {
		const control = this.resetPasswordForm.get('email');

		if (control?.hasError('required')) {
			return 'O campo email é obrigatório';
		}
		if (control?.hasError('email')) {
			return 'Digite um email válido';
		}

		return '';
	}
}
