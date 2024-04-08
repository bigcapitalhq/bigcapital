import { ContactService, type IVendorEditDTO, type IVendorNewDTO } from '@/interfaces';
import { TenantMetadata } from '@/system/models';
import { defaultTo, isEmpty } from 'lodash';
import moment from 'moment';
import { Service } from 'typedi';

@Service()
export class CreateEditVendorDTO {
  /**
   *
   * @param {IVendorNewDTO | IVendorEditDTO} vendorDTO
   * @returns
   */
  private transformCommonDTO = (vendorDTO: IVendorNewDTO | IVendorEditDTO) => {
    return {
      ...vendorDTO,
    };
  };

  /**
   * Transformes the create vendor DTO.
   * @param   {IVendorNewDTO} vendorDTO -
   * @returns {}
   */
  public transformCreateDTO = async (tenantId: number, vendorDTO: IVendorNewDTO) => {
    const commonDTO = this.transformCommonDTO(vendorDTO);

    // Retrieves the tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    return {
      ...commonDTO,
      currencyCode: vendorDTO.currencyCode || tenantMeta.baseCurrency,
      active: defaultTo(vendorDTO.active, true),
      contactService: ContactService.Vendor,

      ...(!isEmpty(vendorDTO.openingBalanceAt)
        ? {
            openingBalanceAt: moment(vendorDTO?.openingBalanceAt).toMySqlDateTime(),
          }
        : {}),
      openingBalanceExchangeRate: defaultTo(vendorDTO.openingBalanceExchangeRate, 1),
    };
  };

  /**
   * Transformes the edit vendor DTO.
   * @param  {IVendorEditDTO} vendorDTO
   * @returns
   */
  public transformEditDTO = (vendorDTO: IVendorEditDTO) => {
    const commonDTO = this.transformCommonDTO(vendorDTO);

    return {
      ...commonDTO,
    };
  };
}
