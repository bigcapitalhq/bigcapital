import { Test, TestingModule } from '@nestjs/testing';
import * as Currencies from 'js-money/lib/currency';
import { InitialCurrenciesSeedService } from './InitialCurrenciesSeed.service';

describe('InitialCurrenciesSeedService', () => {
  let service: InitialCurrenciesSeedService;

  const inserted: any[] = [];
  const findOne = jest.fn<Promise<any>, []>().mockResolvedValue(null);
  const insert = jest.fn((row: any) => {
    inserted.push(row);
    return Promise.resolve(row);
  });
  // The service receives a callable tenant-model proxy:
  // this.currencyModel() returns the model, whose static .query()
  // yields the objection.js query builder.
  const currencyModel = jest.fn(() => ({
    query: () => ({ findOne, insert }),
  }));

  beforeEach(async () => {
    inserted.length = 0;
    findOne.mockResolvedValue(null);
    insert.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitialCurrenciesSeedService,
        {
          // Matches @Inject(Currency.name) in the service constructor.
          provide: 'Currency',
          useValue: currencyModel,
        },
      ],
    }).compile();

    service = module.get<InitialCurrenciesSeedService>(
      InitialCurrenciesSeedService,
    );
  });

  it('seeds a currency from js-money metadata', async () => {
    await service.seedCurrencyByCode('AUD');

    expect(inserted).toEqual([
      {
        currencyCode: 'AUD',
        currencyName: (Currencies as any).AUD.name,
        currencySign: (Currencies as any).AUD.symbol,
      },
    ]);
  });

  it('seeds XCD even though js-money has no metadata for it', async () => {
    expect((Currencies as any).XCD).toBeUndefined();

    await service.seedCurrencyByCode('XCD');

    expect(inserted).toEqual([
      {
        currencyCode: 'XCD',
        currencyName: 'East Caribbean Dollar',
        currencySign: 'EC$',
      },
    ]);
  });

  it('does not insert when the currency already exists', async () => {
    findOne.mockResolvedValue({ id: 1 });

    await service.seedCurrencyByCode('USD');

    expect(inserted).toHaveLength(0);
  });
});
