import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField.model';
import { ReorderCustomFieldsDto } from '../dtos/CustomField.dto';

@Injectable()
export class ReorderCustomFieldsService {
  constructor(
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  /**
   * Reorders custom fields.
   */
  public async reorderCustomFields(
    reorderCustomFieldsDTO: ReorderCustomFieldsDto,
  ): Promise<CustomField[]> {
    await Promise.all(
      reorderCustomFieldsDTO.orders.map((order) =>
        this.customFieldModel()
          .query()
          .findById(order.id)
          .patch({ sortOrder: order.sortOrder } as any),
      ),
    );
    const ids = reorderCustomFieldsDTO.orders.map((order) => order.id);

    return this.customFieldModel()
      .query()
      .whereIn('id', ids)
      .orderBy('sort_order', 'asc');
  }
}
