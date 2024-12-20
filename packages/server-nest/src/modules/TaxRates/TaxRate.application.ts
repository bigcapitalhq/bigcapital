import { CreateTaxRate } from './commands/CreateTaxRate.service';
import { DeleteTaxRateService } from './commands/DeleteTaxRate.service';
import { EditTaxRateService } from './commands/EditTaxRate.service';
import { GetTaxRateService } from './queries/GetTaxRate.service';
// import { GetTaxRatesService } from './queries/GetTaxRates';
import { ActivateTaxRateService } from './commands/ActivateTaxRate.service';
import { InactivateTaxRateService } from './commands/InactivateTaxRate';
import { Injectable } from '@nestjs/common';
import { ICreateTaxRateDTO, IEditTaxRateDTO } from './TaxRates.types';

@Injectable()
export class TaxRatesApplication {
  constructor(
    private readonly createTaxRateService: CreateTaxRate,
    private readonly editTaxRateService: EditTaxRateService,
    private readonly deleteTaxRateService: DeleteTaxRateService,
    private readonly getTaxRateService: GetTaxRateService,
    private readonly activateTaxRateService: ActivateTaxRateService,
    private readonly inactivateTaxRateService: InactivateTaxRateService,
    // private readonly getTaxRatesService: GetTaxRatesService,
  ) {}

  /**
   * Creates a new tax rate.
   * @param {ICreateTaxRateDTO} createTaxRateDTO
   * @returns {Promise<ITaxRate>}
   */
  public createTaxRate(createTaxRateDTO: ICreateTaxRateDTO) {
    return this.createTaxRateService.createTaxRate(createTaxRateDTO);
  }

  /**
   * Edits the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @param {IEditTaxRateDTO} taxRateEditDTO
   * @returns {Promise<ITaxRate>}
   */
  public editTaxRate(taxRateId: number, editTaxRateDTO: IEditTaxRateDTO) {
    return this.editTaxRateService.editTaxRate(taxRateId, editTaxRateDTO);
  }

  /**
   * Deletes the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @returns {Promise<void>}
   */
  public deleteTaxRate(taxRateId: number) {
    return this.deleteTaxRateService.deleteTaxRate(taxRateId);
  }

  /**
   * Retrieves the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @returns {Promise<ITaxRate>}
   */
  public getTaxRate(tenantId: number, taxRateId: number) {
    return this.getTaxRateService.getTaxRate(taxRateId);
  }

  /**
   * Retrieves the tax rates list.
   * @param {number} tenantId
   * @returns {Promise<ITaxRate[]>}
   */
  public getTaxRates(tenantId: number) {
    // return this.getTaxRatesService.getTaxRates(tenantId);
  }

  /**
   * Activates the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   */
  public activateTaxRate(taxRateId: number) {
    return this.activateTaxRateService.activateTaxRate(taxRateId);
  }

  /**
   * Inactivates the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   */
  public inactivateTaxRate(taxRateId: number) {
    return this.inactivateTaxRateService.inactivateTaxRate(taxRateId);
  }
}
