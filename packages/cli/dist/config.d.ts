import { ApiFetcher } from '@bigcapital/sdk-ts';
interface ConfigSchema {
    apiKey: string;
    baseUrl: string;
    organizationId?: string;
}
export declare function getConfig(): ConfigSchema;
export declare function setApiKey(apiKey: string): void;
export declare function setBaseUrl(baseUrl: string): void;
export declare function setOrganizationId(organizationId: string): void;
export declare function validateConfig(): ConfigSchema;
export declare function createAuthenticatedFetcher(): ApiFetcher;
export {};
