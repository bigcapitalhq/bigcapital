import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { UpdateFieldStatusDto } from '../dtos/UpdateFieldStatus.dto';
import { CustomField } from '../models/CustomField';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class UpdateFieldStatusService {
  constructor(
    private readonly uow: UnitOfWork,
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  async updateFieldStatus(fieldId: number, dto: UpdateFieldStatusDto) {
    return this.uow.withTransaction(async (trx) => {
      const customField = await this.customFieldModel().query(trx).findById(fieldId);
      if (!customField) {
        throw new NotFoundException('Custom field not found.');
      }

      return this.customFieldModel()
        .query(trx)
        .patchAndFetchById(fieldId, {
          active: dto.active,
        });
    });
  }
}
