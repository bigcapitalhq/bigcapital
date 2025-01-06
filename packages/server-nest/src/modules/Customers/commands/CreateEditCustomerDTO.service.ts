import moment from 'moment';
import { defaultTo, omit, isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ICustomerEditDTO, ICustomerNewDTO } from '../types/Customers.types';
import { ContactService } from '@/modules/Contacts/types/Contacts.types';

@Injectable()
export class CreateEditCustomerDTO {
  /**
   * @param {TenancyContext} tenancyContext - Tenancy context service.
   */
  constructor(private readonly tenancyContext: TenancyContext) {}

  /**
   * Transformes the create/edit DTO.
   * @param   {ICustomerNewDTO | ICustomerEditDTO} customerDTO
   * @returns
   */
  private transformCommonDTO = (
    customerDTO: ICustomerNewDTO | ICustomerEditDTO,
  ) => {
    return {
      ...omit(customerDTO, ['customerType']),
      contactType: customerDTO.customerType,
    };
  };

  /**
   * Transformes the create DTO.
   * @param {ICustomerNewDTO} customerDTO
   * @returns {Promise<Partial<Customer>>}
   */
  public transformCreateDTO = async (customerDTO: ICustomerNewDTO) => {
    const commonDTO = this.transformCommonDTO(customerDTO);

    // Retrieves the tenant metadata.
    const tenantMeta = await this.tenancyContext.getTenant(true);

    return {
      ...commonDTO,
      currencyCode:
        commonDTO.currencyCode || tenantMeta?.metadata?.baseCurrency,
      active: defaultTo(customerDTO.active, true),
      contactService: ContactService.Customer,
      ...(!isEmpty(customerDTO.openingBalanceAt)
        ? {
            openingBalanceAt: moment(
              customerDTO?.openingBalanceAt,
            ).toMySqlDateTime(),
          }
        : {}),
      openingBalanceExchangeRate: defaultTo(
        customerDTO.openingBalanceExchangeRate,
        1,
      ),
    };
  };

  /**
   * Transformes the edit DTO.
   * @param   {ICustomerEditDTO} customerDTO
   * @returns
   */
  public transformEditDTO = (customerDTO: ICustomerEditDTO) => {
    const commonDTO = this.transformCommonDTO(customerDTO);

    return {
      ...commonDTO,
    };
  };
}
