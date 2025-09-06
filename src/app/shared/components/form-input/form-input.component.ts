import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-form-input',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	template: `<div class="form-field">
		<label [for]="id" class="field-label">
			{{ label }}
			<span class="required-indicator" *ngIf="required">*</span>
		</label>

		<div class="input-container">
			<input
				[id]="id"
				[name]="id"
				[type]="type"
				[placeholder]="placeholder"
				[formControl]="formControl"
				[required]="required"
				[class]="getInputClasses()"
				[attr.aria-describedby]="hasError() ? id + '-error' : null"
				[attr.aria-invalid]="hasError()"
			/>

			<!-- Error Icon -->
			<div class="input-icon error-icon" *ngIf="hasError()">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
					/>
				</svg>
			</div>

			<!-- Success Icon -->
			<div class="input-icon success-icon" *ngIf="isValid()">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
					/>
				</svg>
			</div>
		</div>

		<!-- Error Message -->
		<div
			*ngIf="hasError()"
			[id]="id + '-error'"
			class="error-message"
			role="alert"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{{ getErrorMessage() }}
		</div>

		<!-- Helper Text -->
		<div *ngIf="helperText && !hasError()" class="helper-text">
			{{ helperText }}
		</div>
	</div>`,
	styles: [
		`
			/* ===== FORM FIELD ===== */
			.form-field {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				width: 100%;
			}

			.field-label {
				font-size: 0.875rem;
				font-weight: 600;
				color: #4a5568;
				margin: 0;
				display: flex;
				align-items: center;
				gap: 0.25rem;
			}

			.required-indicator {
				color: #e53e3e;
				font-weight: 700;
			}

			.input-container {
				position: relative;
				display: flex;
				align-items: center;
			}

			.field-input {
				width: 100%;
				padding: 0.875rem 1rem;
				border: 2px solid rgba(102, 126, 234, 0.2);
				border-radius: 12px;
				font-size: 1rem;
				background: white;
				color: #2d3748;
				transition: all 0.3s ease;
				outline: none;
				font-family: inherit;
			}

			.field-input::placeholder {
				color: #a0aec0;
			}

			.field-input:focus {
				border-color: #667eea;
				box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
			}

			.field-input:disabled {
				background: #f7fafc;
				color: #a0aec0;
				cursor: not-allowed;
				border-color: #e2e8f0;
			}

			/* ===== ESTADOS DE VALIDAÇÃO ===== */
			.field-input--error {
				border-color: #e53e3e;
				background: rgba(229, 62, 62, 0.02);
				padding-right: 3rem;
			}

			.field-input--error:focus {
				border-color: #e53e3e;
				box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
			}

			.field-input--success {
				border-color: #38a169;
				background: rgba(56, 161, 105, 0.02);
				padding-right: 3rem;
			}

			.field-input--success:focus {
				border-color: #38a169;
				box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1);
			}

			/* ===== ÍCONES ===== */
			.input-icon {
				position: absolute;
				right: 0.875rem;
				display: flex;
				align-items: center;
				justify-content: center;
				pointer-events: none;
			}

			.error-icon {
				color: #e53e3e;
			}

			.success-icon {
				color: #38a169;
			}

			/* ===== MENSAGENS ===== */
			.error-message {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				font-size: 0.875rem;
				color: #e53e3e;
				background: rgba(229, 62, 62, 0.05);
				padding: 0.5rem 0.75rem;
				border-radius: 8px;
				border: 1px solid rgba(229, 62, 62, 0.2);
				font-weight: 500;
			}

			.helper-text {
				font-size: 0.75rem;
				color: #718096;
				margin: 0;
			}

			/* ===== RESPONSIVIDADE ===== */
			@media (max-width: 768px) {
				.field-input {
					padding: 0.75rem;
					font-size: 0.875rem;
				}

				.field-input--error,
				.field-input--success {
					padding-right: 2.5rem;
				}

				.input-icon {
					right: 0.75rem;
				}

				.error-message {
					font-size: 0.75rem;
					padding: 0.375rem 0.5rem;
				}
			}

			/* ===== DARK MODE ===== */
			@media (prefers-color-scheme: dark) {
				.field-label {
					color: #a0aec0;
				}

				.field-input {
					background: rgba(45, 55, 72, 0.8);
					color: #e2e8f0;
					border-color: rgba(255, 255, 255, 0.2);
				}

				.field-input::placeholder {
					color: #718096;
				}

				.field-input:disabled {
					background: rgba(45, 55, 72, 0.5);
					color: #718096;
				}

				.helper-text {
					color: #a0aec0;
				}
			}

			/* ===== ACESSIBILIDADE ===== */
			.field-input:focus-visible {
				outline: 2px solid #667eea;
				outline-offset: 2px;
			}

			@media (prefers-reduced-motion: reduce) {
				.field-input {
					transition: none;
				}
			}

			/* ===== ANIMAÇÕES ===== */
			.error-message {
				animation: slideInDown 0.3s ease-out;
			}

			@keyframes slideInDown {
				from {
					opacity: 0;
					transform: translateY(-8px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
		`,
	],
})
export class FormInputComponent {
	@Input() id: string = '';
	@Input() label: string = '';
	@Input() type: string = 'text';
	@Input() placeholder: string = '';
	@Input() required: boolean = false;
	@Input() helperText: string = '';
	@Input() formControl!: FormControl;

	hasError(): boolean {
		return (
			this.formControl &&
			this.formControl.invalid &&
			(this.formControl.dirty || this.formControl.touched)
		);
	}

	isValid(): boolean {
		return (
			this.formControl &&
			this.formControl.valid &&
			(this.formControl.dirty || this.formControl.touched)
		);
	}

	getInputClasses(): string {
		const baseClass = 'field-input';

		if (this.hasError()) {
			return `${baseClass} field-input--error`;
		}

		if (this.isValid()) {
			return `${baseClass} field-input--success`;
		}

		return baseClass;
	}

	getErrorMessage(): string {
		if (!this.formControl || !this.formControl.errors) {
			return '';
		}

		const errors = this.formControl.errors;

		if (errors['required']) {
			return `${this.label} é obrigatório`;
		}

		if (errors['email']) {
			return 'Digite um email válido';
		}

		if (errors['minlength']) {
			const requiredLength = errors['minlength'].requiredLength;
			return `Mínimo de ${requiredLength} caracteres`;
		}

		if (errors['maxlength']) {
			const requiredLength = errors['maxlength'].requiredLength;
			return `Máximo de ${requiredLength} caracteres`;
		}

		if (errors['pattern']) {
			return 'Formato inválido';
		}

		return 'Campo inválido';
	}
}
