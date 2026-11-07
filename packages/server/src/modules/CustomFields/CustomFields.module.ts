import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { CustomFieldsController } from './CustomFields.controller';
import { CustomFieldsApplication } from './CustomFieldsApplication.service';
import { CustomFieldsValidator } from './CustomFieldsValidator.service';
import { CustomFieldValuesService } from './CustomFieldValues.service';
import { CreateCustomFieldService } from './commands/CreateCustomField.service';
import { EditCustomFieldService } from './commands/EditCustomField.service';
import { DeleteCustomFieldService } from './commands/DeleteCustomField.service';
import { UpdateCustomFieldStatusService } from './commands/UpdateCustomFieldStatus.service';
import { ReorderCustomFieldsService } from './commands/ReorderCustomFields.service';
import { GetCustomFieldService } from './queries/GetCustomField.service';
import { GetCustomFieldsService } from './queries/GetCustomFields.service';
import { CustomField } from './models/CustomField.model';
import { CustomFieldValue } from './models/CustomFieldValue.model';

const models = [
  RegisterTenancyModel(CustomField),
  RegisterTenancyModel(CustomFieldValue),
];

@Module({
  imports: [...models],
  controllers: [CustomFieldsController],
  providers: [
    CustomFieldsApplication,
    CustomFieldsValidator,
    CustomFieldValuesService,
    CreateCustomFieldService,
    EditCustomFieldService,
    DeleteCustomFieldService,
    UpdateCustomFieldStatusService,
    ReorderCustomFieldsService,
    GetCustomFieldService,
    GetCustomFieldsService,
  ],
  exports: [
    CustomFieldsValidator,
    CustomFieldValuesService,
    GetCustomFieldService,
    GetCustomFieldsService,
    ...models,
  ],
})
export class CustomFieldsModule {}
