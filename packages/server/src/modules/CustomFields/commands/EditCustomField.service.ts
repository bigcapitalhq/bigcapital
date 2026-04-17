import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { EditCustomFieldDto } from '../dtos/CustomField.dto';
import { CustomField } from '../models/CustomField';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class EditCustomFieldService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  async editCustomField(fieldId: number, dto: EditCustomFieldDto) {
    return this.uow.withTransaction(async (trx) => {
      const oldCustomField = await this.customFieldModel().query(trx).findById(fieldId);
      if (!oldCustomField) {
        throw new NotFoundException('Custom field not found.');
      }

      const customField = await this.customFieldModel()
        .query(trx)
        .patchAndFetchById(fieldId, {
          resourceName: dto.resourceName,
          fieldName: dto.fieldName,
          label: dto.label,
          fieldType: dto.fieldType,
          options: dto.options,
          required: dto.required,
          order: dto.order,
          active: dto.active,
          defaultValue: dto.defaultValue,
        });

      this.eventEmitter.emit(events.customField.onEdited, { customField, oldCustomField });

      return customField;
    });
  }
}
