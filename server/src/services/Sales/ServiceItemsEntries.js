import { difference } from "lodash";


export default class ServiceItemsEntries {
  
  static entriesShouldDeleted(storedEntries, entries) {
    const storedEntriesIds = storedEntries.map((e) => e.id);
    const entriesIds = entries.map((e) => e.id);

    return difference(
      storedEntriesIds,
      entriesIds,
    );
  }

}