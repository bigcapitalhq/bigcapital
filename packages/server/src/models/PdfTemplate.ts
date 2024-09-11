import TenantModel from 'models/TenantModel';

export class PdfTemplate extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'pdf_templates';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        templateName: { type: 'string' },
        attributes: { type: 'object' }, // JSON field definition
      },
    };
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }
}
