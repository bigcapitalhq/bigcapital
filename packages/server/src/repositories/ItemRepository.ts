
import { Item } from "models";
import TenantRepository from "./TenantRepository";

export default class ItemRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Item.bindKnex(this.knex);
  }
}