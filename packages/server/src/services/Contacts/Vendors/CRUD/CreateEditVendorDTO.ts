import moment from 'moment';
import { defaultTo, isEmpty } from 'lodash';
import { Service } from 'typedi';
import {
  ContactService,
  IVendor,
  IVendorEditDTO,
  IVendorNewDTO,
} from '@/interfaces';
import { TenantMetadata } from '@/system/models';

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
   * Transforms the create vendor DTO.
   * @param   {IVendorNewDTO} vendorDTO -
   * @returns {}
   */
  public transformCreateDTO = async (
    tenantId: number,
    vendorDTO: IVendorNewDTO
  ) => {
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
            openingBalanceAt: moment(
              vendorDTO?.openingBalanceAt
            ).toMySqlDateTime(),
          }
        : {}),
    };
  };

  /**
   * Transforms the edit vendor DTO.
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
