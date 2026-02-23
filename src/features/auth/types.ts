export interface AuthState {
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  message: string | null;
  error: string | null;
  signupSuccess: boolean;
  resetSuccess: boolean;
  activateSuccess: boolean;
  activateFail: boolean;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  re_password: string;
}
