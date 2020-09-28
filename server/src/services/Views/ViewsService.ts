import { Service, Inject } from "typedi";
import { pick, difference } from 'lodash';
import { ServiceError } from 'exceptions';
import {
  IViewsService,
  IViewDTO,
  IView,
  IViewRole,
  IViewHasColumn,
} from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import { validateRolesLogicExpression } from 'lib/ViewRolesBuilder';

const ERRORS = {
  VIEW_NOT_FOUND: 'VIEW_NOT_FOUND',
  VIEW_PREDEFINED: 'VIEW_PREDEFINED',
  INVALID_LOGIC_EXPRESSION: 'INVALID_LOGIC_EXPRESSION',
};

@Service()
export default class ViewsService implements IViewsService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Listing resource views.
   * @param {number} tenantId 
   * @param {string} resourceModel 
   */
  public async listViews(tenantId: number, resourceModel: string) {
    const { View } = this.tenancy.models(tenantId);
    return View.query().where('resource_model', resourceModel);
  }

  validateResourceFieldsExistance() {

  }

  validateResourceColumnsExistance() {

  }

  getView(tenantId: number, viewId: number) {

  }

  /**
   * Precedures.
   * ----––––––
   * - Validate resource fields existance.
   * - Validate resource columns existance.
   * - Validate view logic expression.
   * - Store view to the storage.
   * - Store view columns to the storage.
   * - Store view roles/conditions to the storage.
   * ---------
   * @param {number} tenantId - Tenant id.
   * @param {IViewDTO} viewDTO - View DTO.
   */
  async newView(tenantId: number, viewDTO: IViewDTO): Promise<void> {
    const { View, ViewColumn, ViewRole } = this.tenancy.models(tenantId);
 
    this.logger.info('[views] trying to create a new view.', { tenantId, viewDTO });
    // Validates the view conditional logic expression.
    if (!validateRolesLogicExpression(viewDTO.logicExpression, viewDTO.roles)) {
      throw new ServiceError(ERRORS.INVALID_LOGIC_EXPRESSION);
    }
    // Save view details.
    const view = await View.query().insert({
      name: viewDTO.name,
      predefined: false,
      rolesLogicExpression: viewDTO.logicExpression,
    });
    this.logger.info('[views] inserted to the storage.', { tenantId, viewDTO });

    // Save view roles async operations.
    const saveViewRolesOpers = [];

    viewDTO.roles.forEach((role) => {
      const saveViewRoleOper = ViewRole.query().insert({
        ...pick(role, ['fieldKey', 'comparator', 'value', 'index']),
        viewId: view.id,
      });
      saveViewRolesOpers.push(saveViewRoleOper);
    });

    viewDTO.columns.forEach((column) => {
      const saveViewColumnOper = ViewColumn.query().insert({
        viewId: view.id,
        index: column.index,
      });
      saveViewRolesOpers.push(saveViewColumnOper);
    });
    this.logger.info('[views] roles and columns inserted to the storage.', { tenantId, viewDTO });

    await Promise.all(saveViewRolesOpers);
  }

  /**
   * 
   * @param {number} tenantId 
   * @param {number} viewId 
   * @param {IViewEditDTO}  
   */
  async editView(tenantId: number, viewId: number, viewEditDTO: IViewEditDTO) {
    const { View, ViewRole, ViewColumn } = req.models;
    const view = await View.query().where('id', viewId)
      .withGraphFetched('roles.field')
      .withGraphFetched('columns')
      .first();

    const errorReasons = [];
    const fieldsSlugs = viewEditDTO.roles.map((role) => role.field_key);
    const resourceFieldsKeys = resource.fields.map((f) => f.key);
    const resourceFieldsKeysMap = new Map(resource.fields.map((field) => [field.key, field]));
    const columnsKeys = viewEditDTO.columns.map((c) => c.key);

    // The difference between the stored resource fields and submit fields keys.
    const notFoundFields = difference(fieldsSlugs, resourceFieldsKeys);

    // Validate not found resource fields keys.
    if (notFoundFields.length > 0) {
      errorReasons.push({
        type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: notFoundFields,
      });
    }
    // The difference between the stored resource fields and the submit columns keys.
    const notFoundColumns = difference(columnsKeys, resourceFieldsKeys);

    // Validate not found view columns.
    if (notFoundColumns.length > 0) {
      errorReasons.push({ type: 'RESOURCE_COLUMNS_NOT_EXIST', code: 200, columns: notFoundColumns });
    }
    // Validates the view conditional logic expression.
    if (!validateViewRoles(viewEditDTO.roles, viewEditDTO.logicExpression)) {
      errorReasons.push({ type: 'VIEW.ROLES.LOGIC.EXPRESSION.INVALID', code: 400 });
    }

    const viewRolesIds = view.roles.map((r) => r.id);
    const viewColumnsIds = view.columns.map((c) => c.id);

    const formUpdatedRoles = viewEditDTO.roles.filter((r) => r.id);
    const formInsertRoles = viewEditDTO.roles.filter((r) => !r.id);

    const formRolesIds = formUpdatedRoles.map((r) => r.id);

    const formUpdatedColumns = viewEditDTO.columns.filter((r) => r.id);
    const formInsertedColumns = viewEditDTO.columns.filter((r) => !r.id);
    const formColumnsIds = formUpdatedColumns.map((r) => r.id);

    const rolesIdsShouldDeleted = difference(viewRolesIds, formRolesIds);
    const columnsIdsShouldDelete = difference(viewColumnsIds, formColumnsIds);

    const notFoundViewRolesIds = difference(formRolesIds, viewRolesIds);
    const notFoundViewColumnsIds = difference(viewColumnsIds, viewColumnsIds);

    // Validate the not found view roles ids.
    if (notFoundViewRolesIds.length) {
      errorReasons.push({ type: 'VIEW.ROLES.IDS.NOT.FOUND', code: 500, ids: notFoundViewRolesIds });
    }
    // Validate the not found view columns ids.
    if (notFoundViewColumnsIds.length) {
      errorReasons.push({ type: 'VIEW.COLUMNS.IDS.NOT.FOUND', code: 600, ids: notFoundViewColumnsIds });
    }
    if (errorReasons.length > 0) {
      return res.status(400).send({ errors: errorReasons });
    }
    const asyncOpers = [];

    // Save view details.
    await View.query()
      .where('id', view.id)
      .patch({
        name: viewEditDTO.name,
        roles_logic_expression: viewEditDTO.logicExpression,
      });

    // Update view roles.
    if (formUpdatedRoles.length > 0) {
      formUpdatedRoles.forEach((role) => {
        const fieldModel = resourceFieldsKeysMap.get(role.field_key);
        const updateOper = ViewRole.query()
          .where('id', role.id)
          .update({
            ...pick(role, ['comparator', 'value', 'index']),
            field_id: fieldModel.id,
          });
        asyncOpers.push(updateOper);
      });
    }
    // Insert a new view roles.
    if (formInsertRoles.length > 0) {
      formInsertRoles.forEach((role) => {
        const fieldModel = resourceFieldsKeysMap.get(role.field_key);
        const insertOper = ViewRole.query()
          .insert({
            ...pick(role, ['comparator', 'value', 'index']),
            field_id: fieldModel.id,
            view_id: view.id,
          });
        asyncOpers.push(insertOper);
      });
    }
    // Delete view roles.
    if (rolesIdsShouldDeleted.length > 0) {
      const deleteOper = ViewRole.query()
        .whereIn('id', rolesIdsShouldDeleted)
        .delete();
      asyncOpers.push(deleteOper);
    }
    // Insert a new view columns to the storage.
    if (formInsertedColumns.length > 0) {
      formInsertedColumns.forEach((column) => {
        const fieldModel = resourceFieldsKeysMap.get(column.key);
        const insertOper = ViewColumn.query()
          .insert({
            field_id: fieldModel.id,
            index: column.index,
            view_id: view.id,
          });
        asyncOpers.push(insertOper);
      });
    }
    // Update the view columns on the storage.
    if (formUpdatedColumns.length > 0) {
      formUpdatedColumns.forEach((column) => {
        const updateOper = ViewColumn.query()
          .where('id', column.id)
          .update({
            index: column.index,
          });
        asyncOpers.push(updateOper);
      });
    }
    // Delete the view columns from the storage.
    if (columnsIdsShouldDelete.length > 0) {
      const deleteOper = ViewColumn.query()
        .whereIn('id', columnsIdsShouldDelete)
        .delete();
      asyncOpers.push(deleteOper);
    }
    await Promise.all(asyncOpers);
  }

  /**
   * Retrieve views details of the given id or throw not found error.
   * @param {number} tenantId 
   * @param {number} viewId 
   */
  private async getViewByIdOrThrowError(tenantId: number, viewId: number): Promise<IView> { 
    const { View } = this.tenancy.models(tenantId);

    this.logger.info('[views] get stored view.', { tenantId, viewId });
    const view = await View.query().findById(viewId);

    if (!view) {
      this.logger.info('[views] the given id not found.', { tenantId, viewId });
      throw new ServiceError(ERRORS.VIEW_NOT_FOUND);
    }
    return view;
  }

  /**
   * Deletes the given view with associated roles and columns.
   * @param {number} tenantId - Tenant id.
   * @param {number} viewId - View id.
   */
  public async deleteView(tenantId: number, viewId: number): Promise<void> {
    const { View } = this.tenancy.models(tenantId);

    this.logger.info('[views] trying to delete the given view.', { tenantId, viewId });
    const view = await this.getViewByIdOrThrowError(tenantId, viewId);

    if (view.predefined) {
      this.logger.info('[views] cannot delete predefined.', { tenantId, viewId });
      throw new ServiceError(ERRORS.VIEW_PREDEFINED);
    }
    await Promise.all([
      view.$relatedQuery('roles').delete(),
      view.$relatedQuery('columns').delete(),
    ]);
    await View.query().where('id', view.id).delete();
    this.logger.info('[views] deleted successfully.', { tenantId, viewId });
  }
}