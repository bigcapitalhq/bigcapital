import { Service, Inject } from 'typedi';
import {
  IItem,
  IItemCreateDTO,
  IItemDTO,
  IItemEditDTO,
  IItemsFilter,
} from '@/interfaces';
import { CreateItem } from './CreateItem';
import { EditItem } from './EditItem';
import { DeleteItem } from './DeleteItem';
import { GetItem } from './GetItem';
import { GetItems } from './GetItems';
import { ActivateItem } from './ActivateItem';
import { InactivateItem } from './InactivateItem';

@Service()
export class ItemsApplication {
  @Inject()
  private createItemService: CreateItem;

  @Inject()
  private editItemService: EditItem;

  @Inject()
  private getItemService: GetItem;

  @Inject()
  private getItemsService: GetItems;

  @Inject()
  private deleteItemService: DeleteItem;

  @Inject()
  private activateItemService: ActivateItem;

  @Inject()
  private inactivateItemService: InactivateItem;

  /**
   * Creates a new item (service/product).
   * @param {number} tenantId
   * @param {IItemCreateDTO} itemDTO
   * @returns {Promise<IItem>}
   */
  public async createItem(
    tenantId: number,
    itemDTO: IItemCreateDTO
  ): Promise<IItem> {
    return this.createItemService.createItem(tenantId, itemDTO);
  }

  /**
   * Retrieves the given item.
   * @param {number} tenantId
   * @param {number} itemId
   * @returns {Promise<IItem>}
   */
  public getItem(tenantId: number, itemId: number): Promise<IItem> {
    return this.getItemService.getItem(tenantId, itemId);
  }

  /**
   * Edits the given item (service/product).
   * @param {number} tenantId
   * @param {number} itemId
   * @param {IItemEditDTO} itemDTO
   * @returns {Promise<IItem>}
   */
  public editItem(tenantId: number, itemId: number, itemDTO: IItemEditDTO) {
    return this.editItemService.editItem(tenantId, itemId, itemDTO);
  }

  /**
   * Deletes the given item (service/product).
   * @param {number} tenantId
   * @param {number} itemId
   * @returns {Promise<void>}
   */
  public deleteItem(tenantId: number, itemId: number) {
    return this.deleteItemService.deleteItem(tenantId, itemId);
  }

  /**
   * Activates the given item (service/product).
   * @param {number} tenantId
   * @param {number} itemId
   * @returns
   */
  public activateItem(tenantId: number, itemId: number): Promise<void> {
    return this.activateItemService.activateItem(tenantId, itemId);
  }

  /**
   * Inactivates the given item.
   * @param {number} tenantId -
   * @param {number} itemId -
   */
  public inactivateItem(tenantId: number, itemId: number): Promise<void> {
    return this.inactivateItemService.inactivateItem(tenantId, itemId);
  }

  /**
   * Retrieves the items paginated list.
   * @param {number} tenantId
   * @param {IItemsFilter} filterDTO
   * @returns {}
   */
  public getItems(tenantId: number, filterDTO: IItemsFilter) {
    return this.getItemsService.getItems(tenantId, filterDTO);
  }
}
