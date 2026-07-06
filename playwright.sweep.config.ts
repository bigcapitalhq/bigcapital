import base from './playwright.config';
export default { ...base, testMatch: 'webapp-sweep.spec.ts', timeout: 15 * 60 * 1000 };
