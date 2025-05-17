import { Injectable } from '@nestjs/common';
import { CreateCurrencyService } from './commands/CreateCurrency.service';
import { EditCurrencyService } from './commands/EditCurrency.service';
import { DeleteCurrencyService } from './commands/DeleteCurrency.service';
import { GetCurrenciesService } from './queries/GetCurrencies.service';
import { GetCurrencyService } from './queries/GetCurrency.service';
import { CreateCurrencyDto } from './dtos/CreateCurrency.dto';
import { EditCurrencyDto } from './dtos/EditCurrency.dto';

@Injectable()
export class CurrenciesApplication {
  constructor(
    private readonly createCurrencyService: CreateCurrencyService,
    private readonly editCurrencyService: EditCurrencyService,
    private readonly deleteCurrencyService: DeleteCurrencyService,
    private readonly getCurrenciesService: GetCurrenciesService,
    private readonly getCurrencyService: GetCurrencyService,
  ) {}

  /**
   * Creates a new currency.
   */
  public createCurrency(currencyDTO: CreateCurrencyDto) {
    return this.createCurrencyService.createCurrency(currencyDTO);
  }

  /**
   * Edits an existing currency.
   */
  public editCurrency(currencyId: number, currencyDTO: EditCurrencyDto) {
    return this.editCurrencyService.editCurrency(currencyId, currencyDTO);
  }

  /**
   * Deletes a currency by code.
   */
  public deleteCurrency(currencyCode: string) {
    return this.deleteCurrencyService.deleteCurrency(currencyCode);
  }

  /**
   * Gets a list of all currencies.
   */
  public getCurrencies() {
    return this.getCurrenciesService.getCurrencies();
  }

  /**
   * Gets a single currency by id or code (to be implemented in GetCurrencyService).
   */
  public getCurrency(currencyCode: string) {
    return this.getCurrencyService.getCurrency(currencyCode);
  }
}
