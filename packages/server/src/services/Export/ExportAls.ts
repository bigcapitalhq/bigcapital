import { Service } from 'typedi';
import { AsyncLocalStorage } from 'async_hooks';

@Service()
export class ExportAls {
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
    return this.als.run<T>(new Map(), () => {
      this.markAsExport();

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
   * Marks the current context as an export operation.
   * @param flag Boolean flag to set or unset the export status. Defaults to true.
   */
  public markAsExport(flag: boolean = true): void {
    const store = this.getStore();
    store?.set('isExport', flag);
  }
  /**
   * Checks if the current context is an export operation.
   * @returns {boolean} True if the context is an export operation, false otherwise.
   */
  public get isExport(): boolean {
    return !!this.getStore()?.get('isExport');
  }
}
