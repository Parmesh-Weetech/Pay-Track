import { ErrorCode } from "./error-code";

export type DefaultErrorMessage = {
    message: string;
    statusCode: number;
};

export const defaultErrorMessages: Record<ErrorCode, DefaultErrorMessage> = {
    [ErrorCode.BAD_REQUEST]: {
        message: "Bad request",
        statusCode: 400,
    },
    [ErrorCode.UNAUTHORIZED]: {
        message: "Unauthorized",
        statusCode: 401,
    },
    [ErrorCode.FORBIDDEN]: {
        message: "Forbidden",
        statusCode: 403,
    },
    [ErrorCode.NOT_FOUND]: {
        message: "Not found",
        statusCode: 404,
    },
    [ErrorCode.INTERNAL_SERVER_ERROR]: {
        message: "Internal server error",
        statusCode: 500,
    },

    [ErrorCode.ENVIRONMENT_VARIABLE_NOT_DEFINED]: {
        message: "Environment variable is not defined",
        statusCode: 500,
    },
    [ErrorCode.INVALID_NODE_ENV]: {
        message: 'Invalid NODE_ENV value',
        statusCode: 500,
    },

    [ErrorCode.USER_NOT_FOUND]: {
        message: "User not found",
        statusCode: 404,
    },
    [ErrorCode.USER_ALREADY_EXISTS]: {
        message: "User already exists",
        statusCode: 409,
    },
    [ErrorCode.USER_ALREADY_REGISTERED]: {
        message: "User already registered",
        statusCode: 409,
    },
    [ErrorCode.INVALID_USER_STATUS]: {
        message: "Invalid user status",
        statusCode: 400,
    },

    [ErrorCode.PRODUCT_NOT_FOUND]: {
        message: "Product not found",
        statusCode: 404,
    },
    [ErrorCode.PRODUCT_NOT_AVAILABLE]: {
        message: "Product not available",
        statusCode: 409,
    },

    [ErrorCode.CART_NOT_FOUND]: {
        message: "Cart not found",
        statusCode: 404,
    },
    [ErrorCode.CART_EMPTY]: {
        message: "Cart is empty",
        statusCode: 400,
    },
    [ErrorCode.INVALID_CART_STATUS]: {
        message: "Invalid cart status",
        statusCode: 400,
    },

    [ErrorCode.ORDER_NOT_FOUND]: {
        message: "Order not found",
        statusCode: 404,
    },
    [ErrorCode.INVALID_ORDER_STATUS]: {
        message: "Invalid order status",
        statusCode: 400,
    },

    [ErrorCode.TRANSACTION_NOT_FOUND]: {
        message: "Transaction not found",
        statusCode: 404,
    },
    [ErrorCode.INVALID_TRANSACTION_STATUS]: {
        message: "Invalid transaction status",
        statusCode: 400,
    },
    [ErrorCode.INVALID_PAYMENT_METHOD]: {
        message: "Invalid payment method",
        statusCode: 400,
    },
    [ErrorCode.PAYMENT_FAILED]: {
        message: "Payment failed",
        statusCode: 402,
    },

    [ErrorCode.TRANSACTION_HISTORY_NOT_FOUND]: {
        message: "Transaction history not found",
        statusCode: 404,
    },
};
