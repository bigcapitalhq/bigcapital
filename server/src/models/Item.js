import { Model } from "objection";
import TenantModel from "models/TenantModel";
import { buildFilterQuery } from "lib/ViewRolesBuilder";

export default class Item extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return "items";
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ["createdAt", "updatedAt"];
  }

  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      sortBy(query, columnSort, sortDirection) {
        query.orderBy(columnSort, sortDirection);
      },
      viewRolesBuilder(query, conditions, logicExpression) {
        buildFilterQuery(Item.tableName, conditions, logicExpression)(query);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Media = require("models/Media");
    const Account = require("models/Account");
    const ItemCategory = require("models/ItemCategory");

    return {
      /**
       * Item may belongs to cateogory model.
       */
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemCategory.default,
        join: {
          from: "items.categoryId",
          to: "items_categories.id",
        },
      },

      costAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: "items.costAccountId",
          to: "accounts.id",
        },
      },

      sellAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: "items.sellAccountId",
          to: "accounts.id",
        },
      },

      inventoryAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: "items.inventoryAccountId",
          to: "accounts.id",
        },
      },

      media: {
        relation: Model.ManyToManyRelation,
        modelClass: Media.default,
        join: {
          from: "items.id",
          through: {
            from: "media_links.model_id",
            to: "media_links.media_id",
          },
          to: "media.id",
        },
      },
    };
  }

  /**
   * Item fields.
   */
  static get fields() {
    return {
      type: {
        label: "Type",
        column: "type",
      },
      name: {
        label: "Name",
        column: "name",
      },
      code: {
        label: "Code",
        column: "code",
      },
      sellable: {
        label: "Sellable",
        column: "sellable",
      },
      purchasable: {
        label: "Purchasable",
        column: "purchasable",
      },
      sell_price: {
        label: "Sell price",
        column: "sell_price",
      },
      cost_price: {
        label: "Cost price",
        column: "cost_price",
      },
      currency_code: {
        label: "Currency",
        column: "currency_code",
      },
      cost_account: {
        label: "Cost account",
        column: "cost_account_id",
        relation: "accounts.id",
        relationColumn: "accounts.name",
      },
      sell_account: {
        label: "Sell account",
        column: "sell_account_id",
        relation: "accounts.id",
        relationColumn: "accounts.name",
      },
      inventory_account: {
        label: "Inventory account",
        column: "inventory_account_id",
        relation: "accounts.id",
        relationColumn: "accounts.name",
      },
      sell_description: {
        label: "Sell description",
        column: "sell_description",
      },
      purchase_description: {
        label: "Purchase description",
        column: "purchase_description",
      },
      quantity_on_hand: {
        label: "Quantity on hand",
        column: "quantity_on_hand",
      },
      note: {
        label: "Note",
        column: "note",
      },
      category: {
        label: "Category",
        column: "category_id",
        relation: "items_categories.id",
        relationColumn: "items_categories.name",
      },
      active: {
        label: "Active",
        column: "active",
      },
      // user: {
      //   label: 'User',
      //   column: 'user_id',
      //   relation: 'users.id',
      //   relationColumn: 'users.',
      // },
      created_at: {
        label: "Created at",
        column: "created_at",
        columnType: "date",
        fieldType: "date",
      },
    };
  }
}
