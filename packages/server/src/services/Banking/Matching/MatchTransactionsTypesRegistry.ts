import { camelCase, upperFirst } from 'lodash';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';

export class MatchTransactionsTypesRegistry {
  private static instance: MatchTransactionsTypesRegistry;
  private importables: Record<string, GetMatchedTransactionsByType>;

  constructor() {
    this.importables = {};
  }

  /**
   * Gets singleton instance of registry.
   * @returns {MatchTransactionsTypesRegistry}
   */
  public static getInstance(): MatchTransactionsTypesRegistry {
    if (!MatchTransactionsTypesRegistry.instance) {
      MatchTransactionsTypesRegistry.instance =
        new MatchTransactionsTypesRegistry();
    }
    return MatchTransactionsTypesRegistry.instance;
  }

  /**
   * Registers the given importable service.
   * @param {string} resource
   * @param {GetMatchedTransactionsByType} importable
   */
  public register(
    resource: string,
    importable: GetMatchedTransactionsByType
  ): void {
    const _resource = this.sanitizeResourceName(resource);
    this.importables[_resource] = importable;
  }

  /**
   * Retrieves the importable service instance of the given resource name.
   * @param {string} name
   * @returns {GetMatchedTransactionsByType}
   */
  public get(name: string): GetMatchedTransactionsByType {
    const _name = this.sanitizeResourceName(name);
    return this.importables[_name];
  }

  private sanitizeResourceName(resource: string) {
    return upperFirst(camelCase(resource));
  }
}
