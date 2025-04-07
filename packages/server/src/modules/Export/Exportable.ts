export class Exportable {
  /**
   *
   * @param tenantId
   * @returns
   */
  public async exportable(
    query: Record<string, any>,
  ): Promise<Array<Record<string, any>>> {
    return [];
  }

  /**
   *
   * @param data
   * @returns
   */
  public transform(data: Record<string, any>) {
    return data;
  }
}
