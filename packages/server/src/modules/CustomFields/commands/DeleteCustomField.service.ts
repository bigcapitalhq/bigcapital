import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { CustomField } from '../models/CustomField';
import { CustomFieldValue } from '../models/CustomFieldValue';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteCustomFieldService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
    @Inject(CustomFieldValue.name)
    private readonly customFieldValueModel: TenantModelProxy<typeof CustomFieldValue>,
  ) {}

  async deleteCustomField(fieldId: number) {
    return this.uow.withTransaction(async (trx) => {
      const customField = await this.customFieldModel().query(trx).findById(fieldId);
      if (!customField) {
        throw new NotFoundException('Custom field not found.');
      }

      await this.customFieldValueModel().query(trx).where('custom_field_id', fieldId).delete();
      await this.customFieldModel().query(trx).findById(fieldId).delete();

      this.eventEmitter.emit(events.customField.onDeleted, { customField });

      return customField;
    });
  }
}
