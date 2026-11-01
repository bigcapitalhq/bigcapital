export class Exportable {
  /**
   *
   * @param tenantId
   * @returns
   */
  public async exportable(_query: Record<string, any>): Promise<any> {
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
