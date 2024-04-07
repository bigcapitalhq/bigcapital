import { ContactService, ICustomer, ICustomerEditDTO, ICustomerNewDTO } from '@/interfaces';
import { TenantMetadata } from '@/system/models';
import { defaultTo, isEmpty, omit } from 'lodash';
import moment from 'moment';
import { Service } from 'typedi';

@Service()
export class CreateEditCustomerDTO {
  /**
   * Transformes the create/edit DTO.
   * @param   {ICustomerNewDTO | ICustomerEditDTO} customerDTO
   * @returns
   */
  private transformCommonDTO = (customerDTO: ICustomerNewDTO | ICustomerEditDTO): Partial<ICustomer> => {
    return {
      ...omit(customerDTO, ['customerType']),
      contactType: customerDTO.customerType,
    };
  };

  /**
   * Transformes the create DTO.
   * @param   {ICustomerNewDTO} customerDTO
   * @returns {}
   */
  public transformCreateDTO = async (tenantId: number, customerDTO: ICustomerNewDTO) => {
    const commonDTO = this.transformCommonDTO(customerDTO);

    // Retrieves the tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    return {
      ...commonDTO,
      currencyCode: commonDTO.currencyCode || tenantMeta?.baseCurrency,
      active: defaultTo(customerDTO.active, true),
      contactService: ContactService.Customer,
      ...(!isEmpty(customerDTO.openingBalanceAt)
        ? {
            openingBalanceAt: moment(customerDTO?.openingBalanceAt).toMySqlDateTime(),
          }
        : {}),
      openingBalanceExchangeRate: defaultTo(customerDTO.openingBalanceExchangeRate, 1),
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
