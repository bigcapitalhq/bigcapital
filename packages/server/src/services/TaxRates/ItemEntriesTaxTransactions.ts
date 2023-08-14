import { ItemEntry } from "@/models";
import { sumBy } from "lodash";
import { Service } from "typedi";


@Service()
export class ItemEntriesTaxTransactions {
  /**
   * 
   * @param model 
   * @returns 
   */
  public assocTaxAmountWithheldFromEntries(model: any) {
    const entries = model.entries.map((entry) => ItemEntry.fromJson(entry));
    const taxAmountWithheld = sumBy(entries, 'taxAmount');

    if (taxAmountWithheld) {
      model.taxAmountWithheld = taxAmountWithheld;
    }
    return model;
  }
}