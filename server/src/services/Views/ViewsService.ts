import { Service, Inject } from "typedi";
import { difference } from 'lodash';
import { ServiceError } from 'exceptions';
import {
  IViewsService,
  IViewDTO,
  IView,
  IViewEditDTO,
} from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import ResourceService from "services/Resource/ResourceService";
import { validateRolesLogicExpression } from 'lib/ViewRolesBuilder';

const ERRORS = {
  VIEW_NOT_FOUND: 'VIEW_NOT_FOUND',
  VIEW_PREDEFINED: 'VIEW_PREDEFINED',
  VIEW_NAME_NOT_UNIQUE: 'VIEW_NAME_NOT_UNIQUE',
  LOGIC_EXPRESSION_INVALID: 'INVALID_LOGIC_EXPRESSION',
  RESOURCE_FIELDS_KEYS_NOT_FOUND: 'RESOURCE_FIELDS_KEYS_NOT_FOUND',
  RESOURCE_COLUMNS_KEYS_NOT_FOUND: 'RESOURCE_COLUMNS_KEYS_NOT_FOUND',
  RESOURCE_MODEL_NOT_FOUND: 'RESOURCE_MODEL_NOT_FOUND'
};

@Service()
export default class ViewsService implements IViewsService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  resourceService: ResourceService;

  /**
   * Listing resource views.
   * @param {number} tenantId - 
   * @param {string} resourceModel - 
   */
  public async listResourceViews(tenantId: number, resourceModel: string): Promise<IView[]> {
    this.logger.info('[views] trying to retrieve resource views.', { tenantId, resourceModel });

    // Validate the resource model name is valid.
    this.getResourceModelOrThrowError(tenantId, resourceModel);

    const { viewRepository } = this.tenancy.repositories(tenantId);
    return viewRepository.allByResource(resourceModel);
  }

  /**
   * Validate model resource conditions fields existance.
   * @param {string} resourceName 
   * @param {IViewRoleDTO[]} viewRoles 
   */
  private validateResourceRolesFieldsExistance(ResourceModel: IModel, viewRoles: IViewRoleDTO[]) {
    const resourceFieldsKeys = this.resourceService.getResourceFields(ResourceModel);

    const fieldsKeys = viewRoles.map(viewRole => viewRole.fieldKey);
    const notFoundFieldsKeys = difference(fieldsKeys, resourceFieldsKeys);

    if (notFoundFieldsKeys.length > 0) {
      throw new ServiceError(ERRORS.RESOURCE_FIELDS_KEYS_NOT_FOUND);
    }
    return notFoundFieldsKeys;
  }

  /**
   * Validates model resource columns existance.
   * @param {string} resourceName 
   * @param {IViewColumnDTO[]} viewColumns 
   */
  private validateResourceColumnsExistance(ResourceModel: IModel, viewColumns: IViewColumnDTO[]) {
    const resourceFieldsKeys = this.resourceService.getResourceColumns(ResourceModel);

    const fieldsKeys = viewColumns.map((viewColumn: IViewColumnDTO) => viewColumn.fieldKey);
    const notFoundFieldsKeys = difference(fieldsKeys, resourceFieldsKeys);

    if (notFoundFieldsKeys.length > 0) {
      throw new ServiceError(ERRORS.RESOURCE_COLUMNS_KEYS_NOT_FOUND);
    }
    return notFoundFieldsKeys;
  }

  /**
   * Retrieve the given view details with associated conditions and columns.
   * @param {number} tenantId - Tenant id.
   * @param {number} viewId - View id.
   */
  public getView(tenantId: number, viewId: number): Promise<IView> {
    this.logger.info('[view] trying to get view from storage.', { tenantId, viewId });
    return this.getViewOrThrowError(tenantId, viewId);
  }

  /**
   * Retrieve view or throw not found error.
   * @param {number} tenantId - Tenant id.
   * @param {number} viewId - View id.
   */
  private async getViewOrThrowError(tenantId: number, viewId: number): Promise<IView> {
    const { viewRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[view] trying to get view from storage.', { tenantId, viewId });
    const view = await viewRepository.getById(viewId);

    if (!view) {
      this.logger.info('[view] view not found.', { tenantId, viewId });
      throw new ServiceError(ERRORS.VIEW_NOT_FOUND);
    }
    return view;
  }

  /**
   * Retrieve resource model from resource name or throw not found error.
   * @param {number} tenantId 
   * @param {number} resourceModel 
   */
  private getResourceModelOrThrowError(tenantId: number, resourceModel: string): IModel {
    const ResourceModel = this.resourceService.getModel(tenantId, resourceModel);

    if (!ResourceModel || !ResourceModel.resourceable) {
      throw new ServiceError(ERRORS.RESOURCE_MODEL_NOT_FOUND);
    }
    return ResourceModel;
  }

  /**
   * Validates view name uniqiness in the given resource.
   * @param {number} tenantId 
   * @param {stirng} resourceModel 
   * @param {string} viewName 
   * @param {number} notViewId 
   */
  private async validateViewNameUniquiness(
    tenantId: number,
    resourceModel: string,
    viewName: string,
    notViewId?: number
  ): void {
    const { View } = this.tenancy.models(tenantId);
    const foundViews = await View.query()
      .where('resource_model', resourceModel)
      .where('name', viewName)
      .onBuild((builder) => {
        if (notViewId) {
          builder.whereNot('id', notViewId);
        }
      });

    if (foundViews.length > 0) {
      throw new ServiceError(ERRORS.VIEW_NAME_NOT_UNIQUE);
    }
  }

  /**
   * Creates a new custom view to specific resource.
   * ----––––––
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
  public async newView(tenantId: number, viewDTO: IViewDTO): Promise<IView> {
    const { viewRepository } = this.tenancy.repositories(tenantId);
    this.logger.info('[views] trying to create a new view.', { tenantId, viewDTO });

    // Validate the resource name is exists and resourcable.
    const ResourceModel = this.getResourceModelOrThrowError(tenantId, viewDTO.resourceModel);

    // Validate view name uniquiness.
    await this.validateViewNameUniquiness(tenantId, viewDTO.resourceModel, viewDTO.name);

    // Validate the given fields keys exist on the storage.
    this.validateResourceRolesFieldsExistance(ResourceModel, viewDTO.roles);

    // Validate the given columnable fields keys exists on the storage.
    this.validateResourceColumnsExistance(ResourceModel, viewDTO.columns);

    // Validates the view conditional logic expression.
    if (!validateRolesLogicExpression(viewDTO.logicExpression, viewDTO.roles)) {
      throw new ServiceError(ERRORS.LOGIC_EXPRESSION_INVALID);
    }
    // Save view details.
    const view = await viewRepository.insert({
      predefined: false,
      name: viewDTO.name,
      rolesLogicExpression: viewDTO.logicExpression,
      resourceModel: viewDTO.resourceModel,
      roles: viewDTO.roles,
      columns: viewDTO.columns,
    });
    this.logger.info('[views] inserted to the storage successfully.', { tenantId, viewDTO });
    return view;
  }

  /**
   * Edits view details, roles and columns on the storage.
   * --------
   * Precedures.
   * --------
   * - Validate view existance.
   * - Validate view resource fields existance.
   * - Validate view resource columns existance.
   * - Validate view logic expression.
   * - Delete old view columns and roles.
   * - Re-save view columns and roles.
   * 
   * @param {number} tenantId 
   * @param {number} viewId 
   * @param {IViewEditDTO}  
   */
  public async editView(tenantId: number, viewId: number, viewEditDTO: IViewEditDTO): Promise<void> {
    const { View } = this.tenancy.models(tenantId);
    this.logger.info('[view] trying to edit custom view.', { tenantId, viewId });

    // Retrieve view details or throw not found error.
    const view = await this.getViewOrThrowError(tenantId, viewId);

    // Validate the resource name is exists and resourcable.
    const ResourceModel = this.getResourceModelOrThrowError(tenantId, view.resourceModel);

    // Validate view name uniquiness.
    await this.validateViewNameUniquiness(tenantId, view.resourceModel, viewEditDTO.name, viewId);

    // Validate the given fields keys exist on the storage.
    this.validateResourceRolesFieldsExistance(ResourceModel, view.roles);

    // Validate the given columnable fields keys exists on the storage.
    this.validateResourceColumnsExistance(ResourceModel, view.columns);

    // Validates the view conditional logic expression.
    if (!validateRolesLogicExpression(viewEditDTO.logicExpression, viewEditDTO.roles)) {
      throw new ServiceError(ERRORS.LOGIC_EXPRESSION_INVALID);
    }
    // Save view details.
    await View.query()
      .where('id', view.id)
      .patch({
        name: viewEditDTO.name,
        roles_logic_expression: viewEditDTO.logicExpression,
      });
    this.logger.info('[view] edited successfully.', { tenantId, viewId });
  }

  /**
   * Retrieve views details of the given id or throw not found error.
   * @private
   * @param {number} tenantId 
   * @param {number} viewId 
   * @return {Promise<IView>}
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
   * @return {Promise<void>}
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