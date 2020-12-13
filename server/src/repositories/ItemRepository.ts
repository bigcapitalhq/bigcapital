
import { Item } from "models";
import TenantRepository from "./TenantRepository";

export default class ItemRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = Item;
  }
}