import { Inject, Service } from 'typedi';
import {
  IProjectCreateDTO,
  IProjectCreatePOJO,
  IProjectEditPOJO,
  IProjectGetPOJO,
  IProjectStatus,
  IVendorsFilter,
  ProjectBillableEntriesQuery,
  ProjectBillableEntry,
} from '@/interfaces';
import CreateProject from './CreateProject';
import DeleteProject from './DeleteProject';
import GetProject from './GetProject';
import EditProjectService from './EditProject';
import GetProjects from './GetProjects';
import EditProjectStatusService from './EditProjectStatus';
import GetProjectBillableEntries from './GetProjectBillableEntries';

@Service()
export class ProjectsApplication {
  @Inject()
  private createProjectService: CreateProject;

  @Inject()
  private editProjectService: EditProjectService;

  @Inject()
  private deleteProjectService: DeleteProject;

  @Inject()
  private getProjectService: GetProject;

  @Inject()
  private getProjectsService: GetProjects;

  @Inject()
  private editProjectStatusService: EditProjectStatusService;

  @Inject()
  private getProjectBillable: GetProjectBillableEntries;

  /**
   * Creates a new project.
   * @param {number} tenantId - Tenant id.
   * @param {IProjectCreateDTO} projectDTO - Create project DTO.
   * @return {Promise<IProjectCreatePOJO>}
   */
  public createProject = (
    tenantId: number,
    projectDTO: IProjectCreateDTO
  ): Promise<IProjectCreatePOJO> => {
    return this.createProjectService.createProject(tenantId, projectDTO);
  };

  /**
   * Edits details of the given vendor.
   * @param {number} tenantId - Tenant id.
   * @param {number} vendorId - Vendor id.
   * @param {IProjectCreateDTO} projectDTO - Create project DTO.
   * @returns {Promise<IVendor>}
   */
  public editProject = (
    tenantId: number,
    projectId: number,
    projectDTO: IProjectCreateDTO
  ): Promise<IProjectEditPOJO> => {
    return this.editProjectService.editProject(tenantId, projectId, projectDTO);
  };

  /**
   * Deletes the given project.
   * @param {number} tenantId
   * @param {number} vendorId
   * @return {Promise<void>}
   */
  public deleteProject = (
    tenantId: number,
    projectId: number
  ): Promise<void> => {
    return this.deleteProjectService.deleteProject(tenantId, projectId);
  };

  /**
   * Retrieves the vendor details.
   * @param {number} tenantId
   * @param {number} projectId
   * @returns {Promise<IProjectGetPOJO>}
   */
  public getProject = (
    tenantId: number,
    projectId: number
  ): Promise<IProjectGetPOJO> => {
    return this.getProjectService.getProject(tenantId, projectId);
  };

  /**
   * Retrieves the vendors paginated list.
   * @param {number} tenantId
   * @param {IVendorsFilter} filterDTO
   * @returns {Promise<IProjectGetPOJO[]>}
   */
  public getProjects = (
    tenantId: number,
    filterDTO: IVendorsFilter
  ): Promise<IProjectGetPOJO[]> => {
    return this.getProjectsService.getProjects(tenantId);
  };

  /**
   * Edits the given project status.
   * @param {number} tenantId
   * @param {number} projectId
   * @param {IProjectStatus} status
   * @returns {Promise<IProject>}
   */
  public editProjectStatus = (
    tenantId: number,
    projectId: number,
    status: IProjectStatus
  ) => {
    return this.editProjectStatusService.editProjectStatus(
      tenantId,
      projectId,
      status
    );
  };

  /**
   * Retrieves the billable entries of the given project.
   * @param {number} tenantId
   * @param {number} projectId
   * @param {ProjectBillableEntriesQuery} query
   * @returns {Promise<ProjectBillableEntry[]>}
   */
  public getProjectBillableEntries = (
    tenantId: number,
    projectId: number,
    query?: ProjectBillableEntriesQuery
  ): Promise<ProjectBillableEntry[]> => {
    return this.getProjectBillable.getProjectBillableEntries(
      tenantId,
      projectId,
      query
    );
  };
}
