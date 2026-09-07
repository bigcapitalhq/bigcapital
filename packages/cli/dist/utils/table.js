"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = createTable;
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
exports.truncate = truncate;
exports.formatStatus = formatStatus;
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createTable(headers) {
    return new cli_table3_1.default({
        head: headers.map(h => chalk_1.default.cyan.bold(h)),
        style: {
            head: [],
            border: [],
        },
        chars: {
            top: '─',
            'top-mid': '┬',
            'top-left': '┌',
            'top-right': '┐',
            bottom: '─',
            'bottom-mid': '┴',
            'bottom-left': '└',
            'bottom-right': '┘',
            left: '│',
            'left-mid': '├',
            mid: '─',
            'mid-mid': '┼',
            right: '│',
            'right-mid': '┤',
            middle: '│',
        },
    });
}
function formatCurrency(amount, currency = '$') {
    if (amount === undefined || amount === null)
        return '-';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num))
        return '-';
    return `${currency}${num.toFixed(2)}`;
}
function formatDate(dateStr) {
    if (!dateStr)
        return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime()))
        return dateStr;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
function truncate(str, maxLength) {
    if (!str)
        return '-';
    if (str.length <= maxLength)
        return str;
    return str.substring(0, maxLength - 3) + '...';
}
function formatStatus(status) {
    if (!status)
        return '-';
    const statusColors = {
        published: chalk_1.default.green,
        draft: chalk_1.default.gray,
        delivered: chalk_1.default.blue,
        partial: chalk_1.default.yellow,
        paid: chalk_1.default.green.bold,
        unpaid: chalk_1.default.red,
        overdue: chalk_1.default.red.bold,
        active: chalk_1.default.green,
        inactive: chalk_1.default.gray,
    };
    const lowerStatus = status.toLowerCase();
    const colorFn = statusColors[lowerStatus] || chalk_1.default.white;
    return colorFn(status);
}
