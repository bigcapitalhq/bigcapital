import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Currency } from '../models/Currency.model';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { CurrencyTransformer } from '../Currency.transformer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetCurrencyService {
  constructor(
    @Inject(Currency.name)
    private readonly currencyModel: TenantModelProxy<typeof Currency>,
    private readonly transformInjectable: TransformerInjectable,
  ) {}

  getCurrency(currencyCode: string) {
    const currency = this.currencyModel()
      .query()
      .findOne('currencyCode', currencyCode)
      .throwIfNotFound();

    return this.transformInjectable.transform(
      currency,
      new CurrencyTransformer(),
    );
  }
}
