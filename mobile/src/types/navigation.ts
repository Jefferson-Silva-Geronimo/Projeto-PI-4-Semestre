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

  ProductDetails: {
    productId: string;
  };

  Cart: undefined;
  Checkout: undefined;
  Orders: undefined;

  OrderDetails: {
    orderId: string;
  };
};

export type AdminStackParamList = {
  AdminHome: undefined;
  AdminProducts: undefined;
  CreateProduct: undefined;

  EditProduct: {
    productId: string;
  };

  AdminOrders: undefined;

  AdminOrderDetails: {
    orderId: string;
  };
};