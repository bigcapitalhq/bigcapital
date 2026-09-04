import Table from 'cli-table3';
export declare function createTable(headers: string[]): Table.Table;
export declare function formatCurrency(amount: number | string | undefined, currency?: string): string;
export declare function formatDate(dateStr: string | undefined): string;
export declare function truncate(str: string | undefined, maxLength: number): string;
export declare function formatStatus(status: string | undefined): string;
