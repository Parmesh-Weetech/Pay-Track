import { CustomExceptionFactory } from "../exception/custom-exception.factory";
import { ErrorCode } from "../exception/error-code";
import { getEnvVal } from "../helper/env";
import { PLATFORM_ENVIRONMENT } from "../types/platform-environment.types";

declare global {
    interface EnvVar {
        PORT: string;
    }
}

export const environmentConfig = () => {
    const environment = getEnvVal('NODE_ENV');
    if (!Object.values(PLATFORM_ENVIRONMENT).includes(environment)) {
        throw CustomExceptionFactory.create(ErrorCode.INVALID_NODE_ENV);
    }
    return {
        environment: environment,
        isProd: environment === 'prod',
        isDev: environment === 'dev',
        isTest: environment === 'test',
    };
};