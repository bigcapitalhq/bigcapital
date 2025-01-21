import * as moment from 'moment';
import { defaultTo, isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { IVendorEditDTO, IVendorNewDTO } from '../types/Vendors.types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ContactService } from '@/modules/Contacts/types/Contacts.types';
import { Vendor } from '../models/Vendor';

@Injectable()
export class CreateEditVendorDTOService {
  /**
   * @param {TenancyContext} tenancyContext - Tenancy context service.
   */
  constructor(private readonly tenancyContext: TenancyContext) {}

  /**
   * Transforms the common vendor DTO.
   * @param {IVendorNewDTO | IVendorEditDTO} vendorDTO
   * @returns {IVendorNewDTO | IVendorEditDTO}
   */
  private transformCommonDTO = (vendorDTO: IVendorNewDTO | IVendorEditDTO) => {
    return {
      ...vendorDTO,
    };
  };

  /**
   * Transformes the create vendor DTO.
   * @param {IVendorNewDTO} vendorDTO -
   * @returns {IVendorNewDTO}
   */
  public transformCreateDTO = async (
    vendorDTO: IVendorNewDTO,
  ): Promise<Partial<Vendor>> => {
    const commonDTO = this.transformCommonDTO(vendorDTO);

    // Retrieves the tenant metadata.
    const tenant = await this.tenancyContext.getTenant(true);

    return {
      ...commonDTO,
      currencyCode: vendorDTO.currencyCode || tenant.metadata.baseCurrency,
      active: defaultTo(vendorDTO.active, true),
      contactService: ContactService.Vendor,

      ...(!isEmpty(vendorDTO.openingBalanceAt)
        ? {
            openingBalanceAt: moment(
              vendorDTO?.openingBalanceAt,
            ).toMySqlDateTime(),
          }
        : {}),
      openingBalanceExchangeRate: defaultTo(
        vendorDTO.openingBalanceExchangeRate,
        1,
      ),
    };
  };

  /**
   * Transformes the edit vendor DTO.
   * @param {IVendorEditDTO} vendorDTO
   * @returns {IVendorEditDTO}
   */
  public transformEditDTO = (vendorDTO: IVendorEditDTO) => {
    const commonDTO = this.transformCommonDTO(vendorDTO);

    return {
      ...commonDTO,
    };
  };
}
