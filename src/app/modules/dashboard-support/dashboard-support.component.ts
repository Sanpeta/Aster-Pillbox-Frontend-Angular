import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { SupportService } from './../../services/support/support.service';

@Component({
	selector: 'app-dashboard-support',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './dashboard-support.component.html',
	styleUrl: './dashboard-support.component.css',
})
export class DashboardSupportComponent {
	private destroy$ = new Subject<void>();
	loading = false; // Inicialmente, a página está carregando
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	constructor(
		private formBuilder: FormBuilder,
		private supportService: SupportService,
		private router: Router
	) {}

	supportContactForm = this.formBuilder.group({
		topic: ['', [Validators.required, Validators.minLength(3)]],
		message: ['', [Validators.required, Validators.minLength(5)]],
	});

	ngOnInit(): void {
		this.supportContactForm.reset();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitMessage(): void {
		this.loading = true;
		if (this.supportContactForm.valid) {
			this.supportService
				.sendMessageSupport(
					this.supportContactForm.value as {
						topic: string;
						message: string;
					}
				)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						this.loading = false;
						this.openDialog(
							'Enviado com sucesso!',
							'Em breve entraremos em contato.',
							'Ok',
							'',
							() => {}
						);
					},
					error: (error) => {
						this.loading = false;
						this.openDialog(
							'Problema interno',
							'Não foi possivel enviar o formulário.',
							'Ok',
							'',
							() => {}
						);
					},
					complete: () => {
						this.loading = false;
					},
				});
		} else {
			this.loading = false;
			this.openDialog(
				'Campo(s) Inválidos',
				'Favor colocar o nome e um e-mail válido.',
				'Ok',
				'',
				() => {}
			);
		}
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
