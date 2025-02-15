import * as R from 'ramda';
import { BaseModel } from '@/models/Model';
import { CustomViewBaseModelMixin } from '@/modules/CustomViews/CustomViewBaseModel';
import { MetadataModelMixin } from '@/modules/DynamicListing/models/MetadataModel';
import { SearchableBaseModelMixin } from '@/modules/DynamicListing/models/SearchableBaseModel';
import { ResourceableModelMixin } from '@/modules/Resource/models/ResourcableModel';

const ExtendedItem = R.pipe(
  CustomViewBaseModelMixin,
  SearchableBaseModelMixin,
  ResourceableModelMixin,
  MetadataModelMixin,
)(BaseModel);

export class TenantBaseModel extends ExtendedItem {}

export type TenantModelProxy<T> = () => T;
