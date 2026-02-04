import { ApiProperty } from '@nestjs/swagger';

/**
 * Item API Error Types
 * These error types are returned when item operations fail validation
 */
export enum ItemErrorType {
  /** Item name already exists in the system */
  ItemNameExists = 'ITEM_NAME_EXISTS',
  
  /** Item category was not found */
  ItemCategoryNotFound = 'ITEM_CATEOGRY_NOT_FOUND',
  
  /** Cost account is not a Cost of Goods Sold account */
  CostAccountNotCogs = 'COST_ACCOUNT_NOT_COGS',
  
  /** Cost account was not found */
  CostAccountNotFound = 'COST_ACCOUNT_NOT_FOUMD',
  
  /** Sell account was not found */
  SellAccountNotFound = 'SELL_ACCOUNT_NOT_FOUND',
  
  /** Sell account is not an income account */
  SellAccountNotIncome = 'SELL_ACCOUNT_NOT_INCOME',
  
  /** Inventory account was not found */
  InventoryAccountNotFound = 'INVENTORY_ACCOUNT_NOT_FOUND',
  
  /** Account is not an inventory type account */
  InventoryAccountNotInventory = 'INVENTORY_ACCOUNT_NOT_INVENTORY',
  
  /** Multiple items have associated transactions */
  ItemsHaveAssociatedTransactions = 'ITEMS_HAVE_ASSOCIATED_TRANSACTIONS',
  
  /** Item has associated transactions (singular) */
  ItemHasAssociatedTransactions = 'ITEM_HAS_ASSOCIATED_TRANSACTINS',
  
  /** Item has associated inventory adjustments */
  ItemHasAssociatedInventoryAdjustment = 'ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT',
  
  /** Cannot change item type to inventory */
  ItemCannotChangeInventoryType = 'ITEM_CANNOT_CHANGE_INVENTORY_TYPE',
  
  /** Cannot change type when item has transactions */
  TypeCannotChangeWithItemHasTransactions = 'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS',
  
  /** Inventory account cannot be modified */
  InventoryAccountCannotModified = 'INVENTORY_ACCOUNT_CANNOT_MODIFIED',
  
  /** Purchase tax rate was not found */
  PurchaseTaxRateNotFound = 'PURCHASE_TAX_RATE_NOT_FOUND',
  
  /** Sell tax rate was not found */
  SellTaxRateNotFound = 'SELL_TAX_RATE_NOT_FOUND',
  
  /** Income account is required for sellable items */
  IncomeAccountRequiredWithSellableItem = 'INCOME_ACCOUNT_REQUIRED_WITH_SELLABLE_ITEM',
  
  /** Cost account is required for purchasable items */
  CostAccountRequiredWithPurchasableItem = 'COST_ACCOUNT_REQUIRED_WITH_PURCHASABLE_ITEM',
  
  /** Item not found */
  NotFound = 'NOT_FOUND',
  
  /** Items not found */
  ItemsNotFound = 'ITEMS_NOT_FOUND',
}

/**
 * Item API Error Response
 * Returned when an item operation fails
 */
export class ItemErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type identifier',
    enum: ItemErrorType,
    example: ItemErrorType.ItemNameExists,
  })
  type: ItemErrorType;

  @ApiProperty({
    description: 'Human-readable error message',
    example: 'The item name is already exist.',
    required: false,
    nullable: true,
  })
  message: string | null;

  @ApiProperty({
    description: 'Additional error payload data',
    required: false,
    nullable: true,
  })
  payload: any;
}

/**
 * Item API Error Response Wrapper
 */
export class ItemApiErrorResponseDto {
  @ApiProperty({
    description: 'Array of error details',
    type: [ItemErrorResponseDto],
  })
  errors: ItemErrorResponseDto[];
}
