// services/dialog.service.ts
import { Injectable, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

export interface DialogData {
	title: string;
	message: string;
	confirmText: string;
	cancelText?: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	icon?: string;
}

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	/**
	 * Abre um diálogo genérico
	 */
	openDialog(
		container: ViewContainerRef,
		data: DialogData,
		onConfirm?: () => void,
		onClose?: () => void
	): void {
		const componentRef = container.createComponent(DialogComponent);

		componentRef.instance.data = {
			title: data.title,
			mensage: data.message, // Mantendo o nome original para compatibilidade
			buttonTextConfirm: data.confirmText,
			buttonTextClose: data.cancelText,
			type: data.type,
			icon: data.icon,
		};

		componentRef.instance.close.subscribe(() => {
			if (onClose) {
				onClose();
			}
			container.clear();
		});

		componentRef.instance.confirm.subscribe(() => {
			if (onConfirm) {
				onConfirm();
			}
			container.clear();
		});
	}

	/**
	 * Abre um diálogo de sucesso
	 */
	openSuccessDialog(
		container: ViewContainerRef,
		title: string,
		message: string,
		confirmText: string = 'OK',
		onConfirm?: () => void
	): void {
		const data: DialogData = {
			title,
			message,
			confirmText,
			type: 'success',
		};
		this.openDialog(container, data, onConfirm);
	}

	/**
	 * Abre um diálogo de erro
	 */
	openErrorDialog(
		container: ViewContainerRef,
		title: string,
		message: string,
		confirmText: string = 'OK',
		onConfirm?: () => void
	): void {
		const data: DialogData = {
			title,
			message,
			confirmText,
			type: 'error',
		};
		this.openDialog(container, data, onConfirm);
	}

	/**
	 * Abre um diálogo de confirmação
	 */
	openConfirmDialog(
		container: ViewContainerRef,
		title: string,
		message: string,
		confirmText: string = 'Confirmar',
		cancelText: string = 'Cancelar',
		onConfirm?: () => void,
		onClose?: () => void
	): void {
		const data: DialogData = {
			title,
			message,
			confirmText,
			cancelText,
			type: 'warning',
		};
		this.openDialog(container, data, onConfirm, onClose);
	}

	/**
	 * Abre um diálogo informativo
	 */
	openInfoDialog(
		container: ViewContainerRef,
		title: string,
		message: string,
		confirmText: string = 'OK',
		onConfirm?: () => void
	): void {
		const data: DialogData = {
			title,
			message,
			confirmText,
			type: 'info',
		};
		this.openDialog(container, data, onConfirm);
	}
}
