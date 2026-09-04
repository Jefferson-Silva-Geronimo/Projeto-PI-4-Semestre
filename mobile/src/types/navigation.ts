export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  ResetPassword: {
    token: string;
  };
};

export type ClientStackParamList = {
  ClientHome: undefined;
};

export type AdminStackParamList = {
  AdminHome: undefined;
};