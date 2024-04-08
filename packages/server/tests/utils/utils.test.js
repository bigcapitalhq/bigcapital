import { expect } from '../testInit';
import { dateRangeCollection } from '../utils';

describe('utils', () => {
  describe('dateRangeCollection()', () => {
    it('Should retrieve all range dates.', () => {
      const fromDate = new Date('2020-1-1');
      const toDate = new Date('2020-1-25');

      const range = dateRangeCollection(fromDate, toDate);

      expect(range.length).equals(25);
    });
  });
});
