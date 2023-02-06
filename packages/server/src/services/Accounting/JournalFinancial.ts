import moment from 'moment';
import { IJournalPoster } from '@/interfaces';

export default class JournalFinancial {
  journal: IJournalPoster;
  
  accountsDepGraph: any;

  /**
   * Journal poster.
   * @param {IJournalPoster} journal 
   */
  constructor(journal: IJournalPoster) {
    this.journal = journal;
    this.accountsDepGraph = this.journal.accountsDepGraph;
  }
}