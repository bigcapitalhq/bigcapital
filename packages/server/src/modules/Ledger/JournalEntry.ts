import { ILedgerEntry } from "./types/Ledger.types";

export class JournalEntry {
  entry: ILedgerEntry;
  
  constructor(entry: ILedgerEntry) {
    const defaults = {
      credit: 0,
      debit: 0,
    };
    this.entry = { ...defaults, ...entry };
  }
}
