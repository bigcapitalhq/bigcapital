import { Model } from 'objection';
import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { ImportableModel } from '@/modules/Import/decorators/Import.decorator';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { AssetMeta } from './Asset.meta';

@ExportableModel()
@ImportableModel()
@InjectModelMeta(AssetMeta)
export class Asset extends TenantBaseModel {
  public id!: number;
  public name!: string;
  public code!: string | null;
  public description!: string | null;
  public assetAccountId!: number;
  public categoryId!: number | null;
  public purchasePrice!: number;
  public purchaseDate!: string;
  public purchaseReference!: string | null;
  public purchaseTransactionId!: number | null;
  public purchaseTransactionType!: string | null;
  public depreciationMethod!: 'straight_line' | 'declining_balance' | 'sum_of_years_digits' | 'units_of_production';
  public depreciationRate!: number | null;
  public usefulLifeYears!: number | null;
  public residualValue!: number;
  public depreciationStartDate!: string;
  public depreciationFrequency!: 'daily' | 'monthly' | 'yearly';
  public depreciationExpenseAccountId!: number;
  public accumulatedDepreciationAccountId!: number;
  public openingDepreciation!: number;
  public currentDepreciation!: number;
  public totalDepreciation!: number;
  public bookValue!: number;
  public status!: 'active' | 'fully_depreciated' | 'disposed' | 'sold';
  public disposalDate!: string | null;
  public disposalProceeds!: number | null;
  public disposalGainLoss!: number | null;
  public disposalNotes!: string | null;
  public serialNumber!: string | null;
  public location!: string | null;
  public userId!: number;
  public active!: boolean;
  public createdAt!: string;
  public updatedAt!: string;

  static get tableName() {
    return 'assets';
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get virtualAttributes() {
    return ['netBookValue', 'isDepreciable'];
  }

  get netBookValue(): number {
    return this.purchasePrice - this.totalDepreciation;
  }

  get isDepreciable(): boolean {
    return this.status === 'active' && this.netBookValue > this.residualValue;
  }

  static get relationMappings() {
    const { Account } = require('../../Accounts/models/Account.model');
    const { AssetDepreciationEntry } = require('./AssetDepreciationEntry.model');
    const { ItemCategory } = require('../../ItemCategories/models/ItemCategory.model');

    return {
      assetAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: { from: 'assets.assetAccountId', to: 'accounts.id' },
      },
      depreciationExpenseAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: { from: 'assets.depreciationExpenseAccountId', to: 'accounts.id' },
      },
      accumulatedDepreciationAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: { from: 'assets.accumulatedDepreciationAccountId', to: 'accounts.id' },
      },
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemCategory,
        join: { from: 'assets.categoryId', to: 'items_categories.id' },
      },
      depreciationEntries: {
        relation: Model.HasManyRelation,
        modelClass: AssetDepreciationEntry,
        join: { from: 'assets.id', to: 'asset_depreciation_entries.assetId' },
      },
    };
  }

  static get modifiers() {
    return {
      active(query, active = true) {
        query.where('assets.active', active);
      },
      byStatus(query, status: string) {
        query.where('assets.status', status);
      },
      depreciable(query) {
        query.whereIn('assets.status', ['active', 'fully_depreciated']);
      },
    };
  }

  static get searchRoles() {
    return [
      { condition: 'or', fieldKey: 'name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'code', comparator: 'like' },
    ];
  }
}
