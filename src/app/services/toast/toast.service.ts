import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	EmbeddedViewRef,
	Injectable,
	Injector,
} from '@angular/core';
import { ToastComponent } from '../../shared/components/toast/toast.component';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
	providedIn: 'root',
})
export class ToastService {
	private toastRef: ComponentRef<ToastComponent> | null = null;
	private timeout: any;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector
	) {}

	showToast(message: string, type: ToastType, duration: number = 3000): void {
		this.clearExistingToast();

		// Create a component reference
		const componentRef = this.componentFactoryResolver
			.resolveComponentFactory(ToastComponent)
			.create(this.injector);

		// Set component properties
		componentRef.instance.message = message;
		componentRef.instance.type = type;

		// Attach to application
		this.appRef.attachView(componentRef.hostView);

		// Get DOM element from component
		const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
			.rootNodes[0] as HTMLElement;

		// Append to body
		document.body.appendChild(domElem);

		// Save reference to component
		this.toastRef = componentRef;

		// Show toast with animation
		setTimeout(() => {
			componentRef.instance.isVisible = true;
		}, 50);

		// Set timeout to remove toast
		this.timeout = setTimeout(() => {
			this.hideToast();
		}, duration);
	}

	private hideToast(): void {
		if (this.toastRef) {
			this.toastRef.instance.isVisible = false;

			// Wait for animation to finish
			setTimeout(() => {
				this.clearExistingToast();
			}, 300);
		}
	}

	private clearExistingToast(): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}

		if (this.toastRef) {
			this.appRef.detachView(this.toastRef.hostView);
			this.toastRef.destroy();
			this.toastRef = null;
		}
	}

	// Convenience methods
	showSuccess(message: string): void {
		this.showToast(message, 'success');
	}

	showError(message: string): void {
		this.showToast(message, 'error');
	}

	showInfo(message: string): void {
		this.showToast(message, 'info');
	}

	showWarning(message: string): void {
		this.showToast(message, 'warning');
	}
}
