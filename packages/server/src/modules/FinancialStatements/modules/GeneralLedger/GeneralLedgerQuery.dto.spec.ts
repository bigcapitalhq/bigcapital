import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GeneralLedgerQueryDto } from './GeneralLedgerQuery.dto';

describe('GeneralLedgerQueryDto', () => {
  // query strings carry every value as a string: ?accountsIds[]=12&accountsIds[]=7
  it('parses query-string account ids into numbers', async () => {
    const dto = plainToInstance(GeneralLedgerQueryDto, {
      accountsIds: ['12', '7'],
    });

    expect(dto.accountsIds).toStrictEqual([12, 7]);
    const errors = await validate(dto, { whitelist: true });
    expect(errors.filter((error) => error.property === 'accountsIds')).toEqual(
      [],
    );
  });

  it('leaves the filter empty when no accounts are given', () => {
    const dto = plainToInstance(GeneralLedgerQueryDto, {});

    expect(dto.accountsIds).toBeUndefined();
  });
});
