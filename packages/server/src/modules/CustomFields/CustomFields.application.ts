import { Injectable } from '@nestjs/common';
import { CreateCustomFieldService } from './commands/CreateCustomField.service';
import { EditCustomFieldService } from './commands/EditCustomField.service';
import { DeleteCustomFieldService } from './commands/DeleteCustomField.service';
import { ReorderCustomFieldsService } from './commands/ReorderCustomFields.service';
import { UpdateFieldStatusService } from './commands/UpdateFieldStatus.service';
import { GetCustomFieldService } from './queries/GetCustomField.service';
import { GetCustomFieldsService } from './queries/GetCustomFields.service';
import { CreateCustomFieldDto, EditCustomFieldDto } from './dtos/CustomField.dto';
import { ReorderCustomFieldsDto } from './dtos/ReorderCustomFields.dto';
import { UpdateFieldStatusDto } from './dtos/UpdateFieldStatus.dto';

@Injectable()
export class CustomFieldsApplication {
  constructor(
    private createCustomFieldService: CreateCustomFieldService,
    private editCustomFieldService: EditCustomFieldService,
    private deleteCustomFieldService: DeleteCustomFieldService,
    private reorderCustomFieldsService: ReorderCustomFieldsService,
    private updateFieldStatusService: UpdateFieldStatusService,
    private getCustomFieldService: GetCustomFieldService,
    private getCustomFieldsService: GetCustomFieldsService,
  ) {}

  async createCustomField(dto: CreateCustomFieldDto) {
    return this.createCustomFieldService.createCustomField(dto);
  }

  async editCustomField(fieldId: number, dto: EditCustomFieldDto) {
    return this.editCustomFieldService.editCustomField(fieldId, dto);
  }

  async deleteCustomField(fieldId: number) {
    return this.deleteCustomFieldService.deleteCustomField(fieldId);
  }

  async getCustomField(fieldId: number) {
    return this.getCustomFieldService.getCustomField(fieldId);
  }

  async getCustomFields(resourceName?: string) {
    return this.getCustomFieldsService.getCustomFields(resourceName);
  }

  async reorderCustomFields(dto: ReorderCustomFieldsDto) {
    return this.reorderCustomFieldsService.reorderCustomFields(dto);
  }

  async updateFieldStatus(fieldId: number, dto: UpdateFieldStatusDto) {
    return this.updateFieldStatusService.updateFieldStatus(fieldId, dto);
  }
}
