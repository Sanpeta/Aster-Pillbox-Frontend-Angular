// ========================================
// ACCOUNT REQUEST INTERFACES
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

export interface CreateAccountRequest {
	organization_id: string;
	email: string;
	password: string;
	role:
		| 'patient'
		| 'caregiver'
		| 'family_member'
		| 'doctor'
		| 'nurse'
		| 'pharmacist'
		| 'admin'
		| 'super_admin';
	permissions?: Record<string, any>;
	notification_preferences?: NotificationPrefs;
}

export interface GetAccountRequest {
	id: string;
}

export interface GetAccountByEmailRequest {
	email: string;
}

export interface ListAccountsRequest {
	limit?: number;
	offset?: number;
	is_active?: boolean;
}

export interface ListAccountsByOrganizationRequest {
	organization_id: string;
	limit?: number;
	offset?: number;
	is_active?: boolean;
}

export interface UpdateAccountRequest {
	id?: string;
	email?: string;
	role?:
		| 'patient'
		| 'caregiver'
		| 'family_member'
		| 'doctor'
		| 'nurse'
		| 'pharmacist'
		| 'admin'
		| 'super_admin';
	permissions?: Record<string, any>;
	notification_preferences?: NotificationPrefs;
	is_active?: boolean;
	is_verified?: boolean;
	metadata?: Record<string, any>;
}

export interface UpdatePasswordRequest {
	current_password: string;
	new_password: string;
}

export interface UpdateMFARequest {
	mfa_enabled: boolean;
	mfa_secret?: string;
}

export interface DeleteAccountRequest {
	password: string; // Confirmação de senha
}

export interface GetUserPermissionsRequest {
	id: string;
}

export interface UpdateStripeCustomerRequest {
	stripe_customer_id: string;
}

export interface CheckEmailAvailabilityRequest {
	email: string;
}

export interface UpdateNotificationPreferencesRequest {
	notification_preferences: NotificationPrefs;
}

export interface UpdateLastLoginRequest {
	id: string;
	last_login_at: string;
}

export interface ActivateAccountRequest {
	activation_token: string;
}

export interface DeactivateAccountRequest {
	reason?: string;
}

export interface BulkUpdateAccountsRequest {
	account_ids: string[];
	updates: Record<string, any>;
}

export interface SearchAccountsRequest {
	query: string;
	role?:
		| 'patient'
		| 'caregiver'
		| 'family_member'
		| 'doctor'
		| 'nurse'
		| 'pharmacist'
		| 'admin'
		| 'super_admin';
	is_active?: boolean;
	limit?: number;
	offset?: number;
}

// ========================================
// ACCOUNT RESPONSE INTERFACES
// ========================================

export interface AccountResponse {
	id: string;
	organization_id: string;
	email: string;
	role: string;
	permissions: Record<string, any>;
	notification_preferences: NotificationPrefs;
	is_active: boolean;
	is_verified: boolean;
	mfa_enabled: boolean;
	stripe_customer_id?: string;
	metadata: Record<string, any>;
	last_login_at?: string;
	created_at: string;
	updated_at: string;
}

export interface AccountListResponse {
	id: string;
	email: string;
	role: string;
	is_active: boolean;
	is_verified: boolean;
	mfa_enabled: boolean;
	last_login_at?: string;
	created_at: string;
	organization_id: string;
}

export interface UserPermissionsResponse {
	account_id: string;
	role: string;
	permissions: Record<string, any>;
	plan_type: string;
	features: Record<string, any>;
	user_type: string; // patient, family_member, healthcare_professional
}

export interface EmailAvailabilityResponse {
	email: string;
	available: boolean;
	message?: string;
}

export interface AccountCreatedResponse {
	id: string;
	email: string;
	message: string;
	next_steps?: string[];
	expires_at?: string;
}

export interface MessageResponse {
	message: string;
	success: boolean;
	data?: Record<string, any>;
	timestamp: string;
}

export interface AccountsListResponse {
	data: AccountListResponse[];
	total: number;
	limit: number;
	offset: number;
	has_more: boolean;
	page: number;
	total_pages: number;
}

export interface AccountStatsResponse {
	total: number;
	active: number;
	verified: number;
	with_mfa: number;
	by_role: Record<string, number>;
	recently_created: number;
	growth_trend: AccountGrowthTrend;
	last_updated: string;
}

export interface AccountGrowthTrend {
	last_week: number;
	last_month: number;
	percentage: number;
	direction: 'up' | 'down' | 'stable';
}

export interface AccountActivityResponse {
	account_id: string;
	last_login_at?: string;
	login_count: number;
	password_changed?: string;
	mfa_enabled: boolean;
	profile_updated?: string;
	recent_activity: AccountActivityLog[];
}

export interface AccountActivityLog {
	action: string;
	timestamp: string;
	ip_address?: string;
	user_agent?: string;
	details?: Record<string, any>;
}

export interface BulkOperationResponse {
	total_requested: number;
	successful: number;
	failed: number;
	results: BulkOperationResult[];
	summary: BulkOperationSummary;
}

export interface BulkOperationResult {
	account_id: string;
	success: boolean;
	error?: string;
}

export interface BulkOperationSummary {
	processing_time: string; // Duration
	success_rate: number;
	errors?: string[];
}

export interface SearchAccountsResponse {
	query: string;
	results: AccountListResponse[];
	total: number;
	limit: number;
	offset: number;
	search_time: string; // Duration
	filters: Record<string, any>;
}

export interface AccountValidationResponse {
	is_valid: boolean;
	errors?: ValidationError[];
	warnings?: ValidationWarning[];
}

export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

export interface ValidationWarning {
	field: string;
	message: string;
	code: string;
}

export interface ErrorResponse {
	error: string;
	message: string;
	code?: string;
	details?: Record<string, any>;
	timestamp: string;
	request_id?: string;
}
