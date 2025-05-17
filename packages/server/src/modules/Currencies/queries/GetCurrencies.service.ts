import { Inject, Injectable } from "@nestjs/common";
import { Currency } from "../models/Currency.model";
import { TenantModelProxy } from "../../System/models/TenantBaseModel";
import { TransformerInjectable } from "../../Transformer/TransformerInjectable.service";
import { CurrencyTransformer } from "../Currency.transformer";

@Injectable()
export class GetCurrenciesService {
  constructor(
    @Inject(Currency.name)
    private readonly currencyModel: TenantModelProxy<typeof Currency>,
    private readonly transformerInjectable: TransformerInjectable,
  ) {

  }
  /**
   * Retrieves currencies list.
   * @return {Promise<ICurrency[]>}
   */
  public async getCurrencies(): Promise<Currency[]> {
    const currencies = await this.currencyModel().query().onBuild((query) => {
      query.orderBy('createdAt', 'ASC');
    });
    return this.transformerInjectable.transform(
      currencies,
      new CurrencyTransformer()
    );
  }
}