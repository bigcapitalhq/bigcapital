import { omit, sumBy, difference } from 'lodash';
import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import {
  IAccount,
  IFilterMeta,
  IPaginationMeta,
  IPaymentReceive,
  IPaymentReceiveCreateDTO,
  IPaymentReceiveEditDTO,
  IPaymentReceiveEntry,
  IPaymentReceiveEntryDTO,
  IPaymentReceivesFilter,
  IPaymentsReceiveService,
  IPaymentReceiveCreatedPayload,
  ISaleInvoice,
  ISystemUser,
  IPaymentReceiveEditedPayload,
  IPaymentReceiveDeletedPayload,
  IPaymentReceiveCreatingPayload,
  IPaymentReceiveDeletingPayload,
  IPaymentReceiveEditingPayload,
  ICustomer,
} from '@/interfaces';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { formatDateFields, entriesAmountDiff } from 'utils';
import { ServiceError } from '@/exceptions';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import AutoIncrementOrdersService from '../AutoIncrementOrdersService';
import { ERRORS } from './constants';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { PaymentReceiveTransfromer } from './PaymentReceiveTransformer';
import UnitOfWork from '@/services/UnitOfWork';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { TenantMetadata } from '@/system/models';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

/**
 * Payment receive service.
 * @service
 */
@Service('PaymentReceives')
export default class PaymentReceiveService implements IPaymentsReceiveService {
  @Inject()
  itemsEntries: ItemsEntriesService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  autoIncrementOrdersService: AutoIncrementOrdersService;

  @Inject('logger')
  logger: any;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  transformer: TransformerInjectable;


}
