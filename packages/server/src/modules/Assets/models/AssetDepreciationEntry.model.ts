import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class AssetDepreciationEntry extends TenantBaseModel {
  public id!: number;
  public assetId!: number;
  public depreciationDate!: string;
  public periodYear!: number;
  public periodMonth!: number;
  public depreciationAmount!: number;
  public accumulatedDepreciation!: number;
  public bookValue!: number;
  public journalId!: number | null;
  public isPosted!: boolean;
  public postedAt!: string | null;
  public createdAt!: string;
  public updatedAt!: string;

  static get tableName() {
    return 'asset_depreciation_entries';
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { Asset } = require('./Asset.model');
    const { ManualJournal } = require('../../ManualJournals/models/ManualJournal');

    return {
      asset: {
        relation: Model.BelongsToOneRelation,
        modelClass: Asset,
        join: { from: 'asset_depreciation_entries.assetId', to: 'assets.id' },
      },
      journal: {
        relation: Model.BelongsToOneRelation,
        modelClass: ManualJournal,
        join: { from: 'asset_depreciation_entries.journalId', to: 'manual_journals.id' },
      },
    };
  }
}
