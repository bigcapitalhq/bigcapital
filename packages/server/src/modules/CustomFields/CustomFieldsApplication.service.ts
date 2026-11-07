import { Injectable } from '@nestjs/common';
import { CreateCustomFieldService } from './commands/CreateCustomField.service';
import { EditCustomFieldService } from './commands/EditCustomField.service';
import { DeleteCustomFieldService } from './commands/DeleteCustomField.service';
import { UpdateCustomFieldStatusService } from './commands/UpdateCustomFieldStatus.service';
import { ReorderCustomFieldsService } from './commands/ReorderCustomFields.service';
import { GetCustomFieldService } from './queries/GetCustomField.service';
import { GetCustomFieldsService } from './queries/GetCustomFields.service';
import {
  CreateCustomFieldDto,
  EditCustomFieldDto,
  GetCustomFieldsQueryDto,
  ReorderCustomFieldsDto,
  UpdateCustomFieldStatusDto,
} from './dtos/CustomField.dto';
import { CustomFieldResource } from './constants';

@Injectable()
export class CustomFieldsApplication {
  constructor(
    private readonly createCustomFieldService: CreateCustomFieldService,
    private readonly editCustomFieldService: EditCustomFieldService,
    private readonly deleteCustomFieldService: DeleteCustomFieldService,
    private readonly updateCustomFieldStatusService: UpdateCustomFieldStatusService,
    private readonly reorderCustomFieldsService: ReorderCustomFieldsService,
    private readonly getCustomFieldService: GetCustomFieldService,
    private readonly getCustomFieldsService: GetCustomFieldsService,
  ) {}

  public createCustomField(createCustomFieldDTO: CreateCustomFieldDto) {
    return this.createCustomFieldService.createCustomField(
      createCustomFieldDTO,
    );
  }

  public editCustomField(
    customFieldId: number,
    editCustomFieldDTO: EditCustomFieldDto,
  ) {
    return this.editCustomFieldService.editCustomField(
      customFieldId,
      editCustomFieldDTO,
    );
  }

  public deleteCustomField(
    customFieldId: number,
    options: { force?: boolean } = {},
  ) {
    return this.deleteCustomFieldService.deleteCustomField(
      customFieldId,
      options,
    );
  }

  public updateCustomFieldStatus(
    customFieldId: number,
    updateCustomFieldStatusDTO: UpdateCustomFieldStatusDto,
  ) {
    return this.updateCustomFieldStatusService.updateCustomFieldStatus(
      customFieldId,
      updateCustomFieldStatusDTO.active,
    );
  }

  public reorderCustomFields(reorderCustomFieldsDTO: ReorderCustomFieldsDto) {
    return this.reorderCustomFieldsService.reorderCustomFields(
      reorderCustomFieldsDTO,
    );
  }

  public getCustomField(customFieldId: number) {
    return this.getCustomFieldService.getCustomField(customFieldId);
  }

  public async getCustomFields(query: GetCustomFieldsQueryDto) {
    const data = await this.getCustomFieldsService.getCustomFields(
      query.resourceName as CustomFieldResource | undefined,
      { includeInactive: query.includeInactive },
    );
    return { data };
  }
}
