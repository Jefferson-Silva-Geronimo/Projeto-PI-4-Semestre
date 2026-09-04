export interface RegisterDTO{
    name: string;
    email: string;
    password: string;
}
export interface LoginDTO {
  email: string;
  password: string;
}
export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}