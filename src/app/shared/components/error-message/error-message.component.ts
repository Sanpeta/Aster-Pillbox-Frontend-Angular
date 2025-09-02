import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
	selector: 'app-error-message',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="error-message" *ngIf="shouldShowError()">
			<svg
				class="error-icon"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span class="error-text" [attr.aria-live]="'polite'">{{
				errorMessage
			}}</span>
		</div>
	`,
	styles: [
		`
			.error-message {
				display: flex;
				align-items: flex-start;
				gap: var(--spacing-2);
				margin-top: var(--spacing-2);
				padding: var(--spacing-2) var(--spacing-3);
				background-color: rgba(239, 68, 68, 0.1);
				border: 1px solid rgba(239, 68, 68, 0.2);
				border-radius: var(--radius-md);
				animation: slideInDown 0.3s ease-out;
			}

			.error-icon {
				width: 1rem;
				height: 1rem;
				color: var(--error);
				flex-shrink: 0;
				margin-top: 1px;
			}

			.error-text {
				font-size: 0.875rem;
				color: var(--error);
				font-weight: 500;
				line-height: 1.4;
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
export class ErrorMessageComponent {
	@Input() control: AbstractControl<any, any> | null = null;
	@Input() errorMessage: string = '';
	@Input() showWhen: 'touched' | 'dirty' | 'always' = 'touched';

	shouldShowError(): boolean {
		if (!this.control || !this.control.errors) {
			return false;
		}

		switch (this.showWhen) {
			case 'touched':
				return this.control.invalid && this.control.touched;
			case 'dirty':
				return this.control.invalid && this.control.dirty;
			case 'always':
				return this.control.invalid;
			default:
				return this.control.invalid && this.control.touched;
		}
	}
}
