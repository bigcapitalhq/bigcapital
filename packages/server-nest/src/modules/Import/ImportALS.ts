import { Service } from 'typedi';
import { AsyncLocalStorage } from 'async_hooks';

@Service()
export class ImportAls {
  private als: AsyncLocalStorage<Map<string, any>>;

  constructor() {
    this.als = new AsyncLocalStorage();
  }

  /**
   * Runs a callback function within the context of a new AsyncLocalStorage store.
   * @param callback The function to be executed within the AsyncLocalStorage context.
   * @returns The result of the callback function.
   */
  public run<T>(callback: () => T): T {
    return this.als.run<T>(new Map(), callback);
  }

  /**
   * Runs a callback function in preview mode within the AsyncLocalStorage context.
   * @param callback The function to be executed in preview mode.
   * @returns The result of the callback function.
   */
  public runPreview<T>(callback: () => T): T {
    return this.run(() => {
      this.markAsImport();
      this.markAsImportPreview();
      return callback();
    });
  }

  /**
   * Runs a callback function in commit mode within the AsyncLocalStorage context.
   * @param {() => T} callback - The function to be executed in commit mode.
   * @returns {T} The result of the callback function.
   */
  public runCommit<T>(callback: () => T): T {
    return this.run(() => {
      this.markAsImport();
      this.markAsImportCommit();
      return callback();
    });
  }

  /**
   * Retrieves the current AsyncLocalStorage store.
   * @returns The current store or undefined if not in a valid context.
   */
  public getStore(): Map<string, any> | undefined {
    return this.als.getStore();
  }

  /**
   * Marks the current context as an import operation.
   * @param flag Boolean flag to set or unset the import status. Defaults to true.
   */
  public markAsImport(flag: boolean = true): void {
    const store = this.getStore();
    store?.set('isImport', flag);
  }

  /**
   * Marks the current context as an import commit operation.
   * @param flag Boolean flag to set or unset the import commit status. Defaults to true.
   */
  public markAsImportCommit(flag: boolean = true): void {
    const store = this.getStore();
    store?.set('isImportCommit', flag);
  }

  /**
   * Marks the current context as an import preview operation.
   * @param {boolean} flag - Boolean flag to set or unset the import preview status. Defaults to true.
   */
  public markAsImportPreview(flag: boolean = true): void {
    const store = this.getStore();
    store?.set('isImportPreview', flag);
  }

  /**
   * Checks if the current context is an import operation.
   * @returns {boolean} True if the context is an import operation, false otherwise.
   */
  public get isImport(): boolean {
    return !!this.getStore()?.get('isImport');
  }

  /**
   * Checks if the current context is an import commit operation.
   * @returns {boolean} True if the context is an import commit operation, false otherwise.
   */
  public get isImportCommit(): boolean {
    return !!this.getStore()?.get('isImportCommit');
  }

  /**
   * Checks if the current context is an import preview operation.
   * @returns {boolean} True if the context is an import preview operation, false otherwise.
   */
  public get isImportPreview(): boolean {
    return !!this.getStore()?.get('isImportPreview');
  }
}
