export enum ErrorCode {
  BAD_REQUEST = 'request.bad-request',
  UNAUTHORIZED = 'auth.unauthorized',
  FORBIDDEN = 'authorization.forbidden',
  NOT_FOUND = 'not-found',
  INTERNAL_SERVER_ERROR = 'server.internal-server-error',

  ENVIRONMENT_VARIABLE_NOT_DEFINED = 'env.environment-variable-not-defined',
  INVALID_NODE_ENV = 'config.invalid-node-env',

  USER_NOT_FOUND = 'user.not-found',
  USER_ALREADY_EXISTS = 'user.already-exists',
  USER_ALREADY_REGISTERED = 'user.already-registered',
  INVALID_USER_STATUS = 'user.invalid-status',

  PRODUCT_NOT_FOUND = 'product.not-found',
  PRODUCT_NOT_AVAILABLE = 'product.not-available',

  CART_NOT_FOUND = 'cart.not-found',
  CART_EMPTY = 'cart.empty',
  INVALID_CART_STATUS = 'cart.invalid-status',

  ORDER_NOT_FOUND = 'order.not-found',
  INVALID_ORDER_STATUS = 'order.invalid-status',

  TRANSACTION_NOT_FOUND = 'transaction.not-found',
  INVALID_TRANSACTION_STATUS = 'transaction.invalid-status',
  INVALID_PAYMENT_METHOD = 'payment.invalid-method',
  PAYMENT_FAILED = 'payment.failed',

  TRANSACTION_HISTORY_NOT_FOUND = 'transaction-history.not-found',
}
