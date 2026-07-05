import base from './playwright.config';
export default { ...base, testMatch: ['invoice-tax-gl.spec.ts', 'invoice-withholding-tax.spec.ts', 'anz-import.spec.ts', 'customer-withholding-field.spec.ts'] };
