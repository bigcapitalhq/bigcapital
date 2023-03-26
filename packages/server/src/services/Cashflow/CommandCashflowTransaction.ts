import { difference, includes } from 'lodash';
import { ICashflowTransactionLine } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import { Inject, Service } from 'typedi';
import { CASHFLOW_TRANSACTION_TYPE, ERRORS } from './constants';
import { IAccount } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export default class CommandCashflowTransaction {
  @Inject()
  private tenancy: HasTenancyService;

}
