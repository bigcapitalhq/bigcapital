import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField.model';
import { GetCustomFieldService } from '../queries/GetCustomField.service';

@Injectable()
export class UpdateCustomFieldStatusService {
  constructor(
    private readonly getCustomFieldService: GetCustomFieldService,

    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  /**
   * Activates/deactivates the given custom field.
   */
  public async updateCustomFieldStatus(
    customFieldId: number,
    active: boolean,
  ): Promise<CustomField> {
    await this.getCustomFieldService.getCustomField(customFieldId);

    return this.customFieldModel()
      .query()
      .patchAndFetchById(customFieldId, { active } as any);
  }
}
