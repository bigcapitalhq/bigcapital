
export default class JournalEntry {
  constructor(entry) {
    const defaults = {
      credit: 0,
      debit: 0,
    };
    this.entry = { ...defaults, ...entry };
  }
}
