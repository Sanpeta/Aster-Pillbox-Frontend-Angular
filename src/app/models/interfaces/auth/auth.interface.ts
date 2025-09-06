// ========================================
// AUTH REQUEST INTERFACES
// ========================================

export interface NotificationPrefs {
	push: boolean;
	email: boolean;
	sms: boolean;
	whatsapp: boolean;
	quiet_hours?: QuietHours;
}

export interface QuietHours {
	enabled: boolean;
	start?: string; // Format: "15:04"
	end?: string; // Format: "15:04"
}

export interface RegisterRequest {
	email: string;
	password: string;
	confirm_password: string;
	notification_preferences?: NotificationPrefs;
}

export interface LoginRequest {
	email: string;
	password: string;
	mfa_code?: string;
}

export interface VerifyEmailRequest {
	token: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	new_password: string;
	confirm_password: string;
}

export interface RefreshTokenRequest {
	refresh_token: string;
}

export interface ResendVerificationRequest {
	email: string;
}

export interface ChangePasswordRequest {
	current_password: string;
	new_password: string;
	confirm_password: string;
}

export interface EnableMFARequest {
	secret?: string;
	mfa_code: string;
}

export interface DisableMFARequest {
	password: string;
	mfa_code: string;
}

export interface VerifyMFARequest {
	mfa_code: string;
}

// ========================================
// AUTH RESPONSE INTERFACES
// ========================================

export interface UserInfo {
	id: string;
	email: string;
	role: string;
	is_verified: boolean;
	mfa_enabled: boolean;
	permissions: Record<string, any>;
	last_login_at?: string;
}

export interface RegisterResponse {
	message: string;
	email: string;
	needs_verify: boolean;
}

export interface LoginResponse {
	access_token: string;
	refresh_token: string;
	expires_at: string;
	token_type: string;
	user: UserInfo;
}

export interface VerifyEmailResponse {
	message: string;
	success: boolean;
	is_active: boolean;
}

export interface ForgotPasswordResponse {
	message: string;
	success: boolean;
}

export interface ResetPasswordResponse {
	message: string;
	success: boolean;
}

export interface RefreshTokenResponse {
	access_token: string;
	expires_at: string;
	token_type: string;
}

export interface CheckAuthResponse {
	success: boolean;
	message: string;
	data: {
		user_id: string;
		role: string;
		expires_at: string;
		issued_at: string;
	};
	timestamp: string;
}

export interface LogoutResponse {
	message: string;
	success: boolean;
}

export interface MFASetupResponse {
	secret: string;
	qr_code: string;
	backup_codes: string[];
	message: string;
}

export interface MFAResponse {
	message: string;
	success: boolean;
}

export interface AuthErrorResponse {
	error: string;
	message: string;
	details?: Record<string, any>;
	timestamp: string;
}
