import { Module } from '@nestjs/common';
import { CustomFieldsController } from './CustomFields.controller';
import { CustomFieldsApplication } from './CustomFields.application';
import { CreateCustomFieldService } from './commands/CreateCustomField.service';
import { EditCustomFieldService } from './commands/EditCustomField.service';
import { DeleteCustomFieldService } from './commands/DeleteCustomField.service';
import { ReorderCustomFieldsService } from './commands/ReorderCustomFields.service';
import { UpdateFieldStatusService } from './commands/UpdateFieldStatus.service';
import { GetCustomFieldService } from './queries/GetCustomField.service';
import { GetCustomFieldsService } from './queries/GetCustomFields.service';
import { GetResourceCustomFieldsService } from './queries/GetResourceCustomFields.service';
import { SaveCustomFieldValuesService } from './queries/SaveCustomFieldValues.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { CustomField } from './models/CustomField';
import { CustomFieldValue } from './models/CustomFieldValue';
import { CustomFieldsEntityEventsSubscriber } from './subscribers/CustomFieldsEntityEventsSubscriber';

const models = [
  RegisterTenancyModel(CustomField),
  RegisterTenancyModel(CustomFieldValue),
];

@Module({
  imports: [...models],
  controllers: [CustomFieldsController],
  providers: [
    CustomFieldsApplication,
    CreateCustomFieldService,
    EditCustomFieldService,
    DeleteCustomFieldService,
    ReorderCustomFieldsService,
    UpdateFieldStatusService,
    GetCustomFieldService,
    GetCustomFieldsService,
    GetResourceCustomFieldsService,
    SaveCustomFieldValuesService,
    CustomFieldsEntityEventsSubscriber,
  ],
  exports: [
    GetResourceCustomFieldsService,
    SaveCustomFieldValuesService,
    GetCustomFieldsService,
    ...models,
  ],
})
export class CustomFieldsModule {}
