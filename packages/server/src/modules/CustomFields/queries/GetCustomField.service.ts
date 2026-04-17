import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField';

@Injectable()
export class GetCustomFieldService {
  constructor(
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  async getCustomField(fieldId: number) {
    const customField = await this.customFieldModel().query().findById(fieldId);
    if (!customField) {
      throw new NotFoundException('Custom field not found.');
    }
    return customField;
  }
}
