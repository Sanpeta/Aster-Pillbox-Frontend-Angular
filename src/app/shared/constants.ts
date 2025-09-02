// ===== CONSTANTES DA APLICAÇÃO =====

export const APP_CONSTANTS = {
	// Cookies
	COOKIES: {
		AUTH_TOKEN: 'AUTH_TOKEN',
		ACCOUNT_EMAIL: 'ACCOUNT_EMAIL',
		ACCOUNT_ID: 'ACCOUNT_ID',
	},

	// Rotas
	ROUTES: {
		HOME: '/',
		LOGIN: '/login',
		REGISTER: '/register',
		DASHBOARD: '/dashboard',
		RECOVER_PASSWORD: '/recover-password',
		CHECK_EMAIL: '/check-your-email',
	},

	// Validações
	VALIDATION: {
		MIN_PASSWORD_LENGTH: 8,
		EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	},

	// Mensagens de erro padrão
	ERROR_MESSAGES: {
		INVALID_CREDENTIALS: {
			title: 'Não Autorizado',
			message: 'Email ou senha inválidos.',
		},
		EMAIL_NOT_FOUND: {
			title: 'Email não encontrado',
			message: 'Verifique os dados informados e tente novamente.',
		},
		GENERIC_ERROR: {
			title: 'Erro no sistema',
			message: 'Ocorreu um erro inesperado. Tente novamente.',
		},
		VALIDATION_ERROR: {
			title: 'Campos Inválidos',
			message:
				'Informe um email válido e uma senha com no mínimo 8 caracteres.',
		},
		ACCOUNT_NOT_ACTIVE: {
			title: 'Conta não ativada',
			message:
				'Solicite o reenvio do email de ativação ou entre em contato com o suporte.',
		},
	},

	// Códigos de status HTTP
	HTTP_STATUS: {
		UNAUTHORIZED: 401,
		NOT_FOUND: 404,
		INTERNAL_SERVER_ERROR: 500,
	} as const,
} as const;

// ===== TIPOS E INTERFACES =====

export interface ErrorInfo {
	title: string;
	message: string;
}

export interface DialogData {
	title: string;
	message: string;
	confirmText: string;
	cancelText?: string;
}

// ===== UTILITÁRIOS =====

export class FormUtils {
	/**
	 * Verifica se um FormControl tem erro e foi tocado
	 */
	static hasError(control: any): boolean {
		return control?.invalid && control?.touched;
	}

	/**
	 * Obtém a primeira mensagem de erro de um FormControl
	 */
	static getErrorMessage(control: any): string {
		if (!control?.errors) return '';

		const errors = control.errors;

		if (errors['required']) return 'Este campo é obrigatório';
		if (errors['email']) return 'Email inválido';
		if (errors['minlength'])
			return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
		if (errors['maxlength'])
			return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;

		return 'Campo inválido';
	}

	/**
	 * Valida se um email tem formato válido
	 */
	static isValidEmail(email: string): boolean {
		return APP_CONSTANTS.VALIDATION.EMAIL_PATTERN.test(email);
	}

	/**
	 * Valida se uma senha atende os critérios mínimos
	 */
	static isValidPassword(password: string): boolean {
		return !!(
			password &&
			typeof password === 'string' &&
			password.length >= APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH
		);
	}
}

export class HttpUtils {
	/**
	 * Obtém informações de erro baseadas no código de status HTTP
	 */
	static getErrorInfo(statusCode: number): ErrorInfo {
		const { ERROR_MESSAGES, HTTP_STATUS } = APP_CONSTANTS;

		switch (statusCode) {
			case HTTP_STATUS.UNAUTHORIZED:
				return ERROR_MESSAGES.INVALID_CREDENTIALS;
			case HTTP_STATUS.NOT_FOUND:
				return ERROR_MESSAGES.EMAIL_NOT_FOUND;
			default:
				return ERROR_MESSAGES.GENERIC_ERROR;
		}
	}

	/**
	 * Verifica se um erro HTTP é de autenticação
	 */
	static isAuthenticationError(statusCode: number): boolean {
		return statusCode === APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED;
	}
}

export class StorageUtils {
	/**
	 * Define um cookie de forma segura
	 */
	static setCookie(cookieService: any, key: string, value: string): void {
		try {
			cookieService.set(key, value, {
				secure: true,
				sameSite: 'Strict',
				path: '/',
			});
		} catch (error) {
			console.error(`Erro ao definir cookie ${key}:`, error);
		}
	}

	/**
	 * Obtém um cookie de forma segura
	 */
	static getCookie(cookieService: any, key: string): string {
		try {
			return cookieService.get(key) || '';
		} catch (error) {
			console.error(`Erro ao obter cookie ${key}:`, error);
			return '';
		}
	}

	/**
	 * Remove um cookie
	 */
	static removeCookie(cookieService: any, key: string): void {
		try {
			cookieService.delete(key, '/');
		} catch (error) {
			console.error(`Erro ao remover cookie ${key}:`, error);
		}
	}
}

// ===== VALIDATORS CUSTOMIZADOS =====

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
	/**
	 * Validador personalizado para senhas fortes
	 */
	static strongPassword(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;

			if (!value) return null;

			const hasNumber = /[0-9]/.test(value);
			const hasUpper = /[A-Z]/.test(value);
			const hasLower = /[a-z]/.test(value);
			const hasSpecial = /[#?!@$%^&*-]/.test(value);
			const isValidLength = value.length >= 8;

			const passwordValid =
				hasNumber &&
				hasUpper &&
				hasLower &&
				hasSpecial &&
				isValidLength;

			if (!passwordValid) {
				return {
					strongPassword: {
						hasNumber,
						hasUpper,
						hasLower,
						hasSpecial,
						isValidLength,
					},
				};
			}

			return null;
		};
	}

	/**
	 * Validador para confirmação de senha
	 */
	static passwordMatch(passwordControlName: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const password = control.parent?.get(passwordControlName);
			const confirmPassword = control.value;

			if (!password || !confirmPassword) return null;

			return password.value === confirmPassword
				? null
				: { passwordMatch: true };
		};
	}
}
