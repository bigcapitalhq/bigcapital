import { Injectable, Inject } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ReorderCustomFieldsDto } from '../dtos/ReorderCustomFields.dto';
import { CustomField } from '../models/CustomField';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class ReorderCustomFieldsService {
  constructor(
    private readonly uow: UnitOfWork,
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  async reorderCustomFields(dto: ReorderCustomFieldsDto) {
    return this.uow.withTransaction(async (trx) => {
      for (let i = 0; i < dto.fieldIds.length; i++) {
        await this.customFieldModel()
          .query(trx)
          .findById(dto.fieldIds[i])
          .patch({ order: i + 1 });
      }

      return this.customFieldModel()
        .query(trx)
        .where('resource_name', dto.resourceName)
        .orderBy('order', 'ASC');
    });
  }
}
