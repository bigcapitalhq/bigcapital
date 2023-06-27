import { ServiceError } from '@/exceptions';
import { ISaleInvoiceCreateDTO, ProjectLinkRefType } from '@/interfaces';
import { difference, isEmpty } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';

@Service()
export class ProjectInvoiceValidator {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Validate the tasks refs ids existence.
   * @param {number} tenantId
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO
   * @returns {Promise<void>}
   */
  async validateTasksRefsExistence(
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceCreateDTO
  ) {
    const { Task } = this.tenancy.models(tenantId);

    // Filters the invoice entries that have `Task` type and not empty ref. id.
    const tasksRefs = saleInvoiceDTO.entries.filter(
      (entry) =>
        entry?.projectRefType === ProjectLinkRefType.Task &&
        !isEmpty(entry?.projectRefId)
    );
    //
    if (!tasksRefs.length || (tasksRefs.length && !saleInvoiceDTO.projectId)) {
      return;
    }
    const tasksRefsIds = tasksRefs.map((ref) => ref.projectRefId);

    const tasks = await Task.query()
      .whereIn('id', tasksRefsIds)
      .where('projectId', saleInvoiceDTO.projectId);

    const tasksIds = tasks.map((task) => task.id);
    const notFoundTasksIds = difference(tasksIds, tasksRefsIds);

    if (!notFoundTasksIds.length) {
      throw new ServiceError(ERRORS.ITEM_ENTRIES_REF_IDS_NOT_FOUND);
    }
  }
}
