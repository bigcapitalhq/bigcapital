import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { TrackingTag } from './TrackingTag';
import { TrackingTagOption } from './TrackingTagOption';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';

export class AccountTransactionTrackingTag extends BaseModel {
  public accountTransactionId!: number;
  public tagId!: number;
  public optionId!: number;

  public tag!: TrackingTag;
  public option!: TrackingTagOption;
  public accountTransaction!: AccountTransaction;

  static get tableName() {
    return 'account_transaction_tracking_tags';
  }

  static get idColumn() {
    return ['accountTransactionId', 'tagId'];
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { TrackingTag } = require('./TrackingTag');
    const { TrackingTagOption } = require('./TrackingTagOption');
    const { AccountTransaction } = require('../../Accounts/models/AccountTransaction.model');

    return {
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingTag,
        join: {
          from: 'account_transaction_tracking_tags.tagId',
          to: 'tracking_tags.id',
        },
      },
      option: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingTagOption,
        join: {
          from: 'account_transaction_tracking_tags.optionId',
          to: 'tracking_tag_options.id',
        },
      },
      accountTransaction: {
        relation: Model.BelongsToOneRelation,
        modelClass: AccountTransaction,
        join: {
          from: 'account_transaction_tracking_tags.accountTransactionId',
          to: 'accounts_transactions.id',
        },
      },
    };
  }
}
