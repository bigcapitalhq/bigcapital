import async from 'async';

export default class JournalContacts {
  saveContactBalanceQueue: any;
  contactsBalanceTable: {
    [key: number]: { credit: number; debit: number };
  } = {};

  constructor(journal) {
    this.journal = journal;
    this.saveContactBalanceQueue = async.queue(
      this.saveContactBalanceChangeTask.bind(this),
      10
    );
  }
  /**
   * Sets the contact balance change.
   */
  private getContactsBalanceChanges(entry) {
    if (!entry.contactId) {
      return;
    }
    const change = {
      debit: entry.debit,
      credit: entry.credit,
    };
    if (!this.contactsBalanceTable[entry.contactId]) {
      this.contactsBalanceTable[entry.contactId] = { credit: 0, debit: 0 };
    }
    if (change.credit) {
      this.contactsBalanceTable[entry.contactId].credit += change.credit;
    }
    if (change.debit) {
      this.contactsBalanceTable[entry.contactId].debit += change.debit;
    }
  }

  /**
   * Save contacts balance change.
   */
  saveContactsBalance() {
    const balanceChanges = Object.entries(
      this.contactsBalanceTable
    ).map(([contactId, { credit, debit }]) => ({ contactId, credit, debit }));

    return this.saveContactBalanceQueue.pushAsync(balanceChanges);
  }

  /**
   * Saves contact balance change task.
   * @param {number} contactId - Contact id.
   * @param {number} credit - Credit amount.
   * @param {number} debit - Debit amount.
   */
  async saveContactBalanceChangeTask({ contactId, credit, debit }, callback) {
    const { contactRepository } = this.repositories;

    const contact = await contactRepository.findOneById(contactId);
    let balanceChange = 0;

    if (contact.contactNormal === 'credit') {
      balanceChange += credit - debit;
    } else {
      balanceChange += debit - credit;
    }
    // Contact change balance.
    await contactRepository.changeNumber(
      { id: contactId },
      'balance',
      balanceChange
    );
    callback();
  }
}
