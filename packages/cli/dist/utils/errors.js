"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
exports.assertDefined = assertDefined;
const chalk_1 = __importDefault(require("chalk"));
function handleError(error) {
    if (error instanceof Error) {
        // Check if it's an HTTP error from the SDK
        const httpError = error;
        if (httpError.status) {
            console.error(chalk_1.default.red(`HTTP Error ${httpError.status}: ${httpError.statusText || error.message}`));
            if (httpError.status === 401) {
                console.error(chalk_1.default.yellow('Your API key may be invalid or expired.'));
                console.error(chalk_1.default.yellow('Run: bigcapital config set api-key <your-new-api-key>'));
            }
            else if (httpError.status === 403) {
                console.error(chalk_1.default.yellow('You don\'t have permission to access this resource.'));
            }
            else if (httpError.status === 404) {
                console.error(chalk_1.default.yellow('The requested resource was not found.'));
            }
        }
        else {
            console.error(chalk_1.default.red(`Error: ${error.message}`));
        }
        if (process.env.DEBUG) {
            console.error(chalk_1.default.gray(error.stack));
        }
    }
    else {
        console.error(chalk_1.default.red('An unknown error occurred'));
        console.error(error);
    }
    process.exit(1);
}
function assertDefined(value, name) {
    if (value === undefined || value === null) {
        console.error(chalk_1.default.red(`Error: ${name} is required but was not provided.`));
        process.exit(1);
    }
    return value;
}
