import { Inject, Service } from 'typedi';
import {
  ICreateTaskDTO,
  IEditTaskDTO,
  IProjectTaskCreatePOJO,
  IProjectTaskEditPOJO,
  IProjectTaskGetPOJO,
} from '@/interfaces';
import { CreateTaskService } from './CreateTask';
import { DeleteTaskService } from './DeleteTask';
import { GetTaskService } from './GetTask';
import { EditTaskService } from './EditTask';
import { GetTasksService } from './GetTasks';

@Service()
export class TasksApplication {
  @Inject()
  private createTaskService: CreateTaskService;

  @Inject()
  private editTaskService: EditTaskService;

  @Inject()
  private deleteTaskService: DeleteTaskService;

  @Inject()
  private getTaskService: GetTaskService;

  @Inject()
  private getTasksService: GetTasksService;

  /**
   * Creates a new task associated to specific project.
   * @param  {number} tenantId - Tenant id.
   * @param  {number} project - Project id.
   * @param  {ICreateTaskDTO} taskDTO - Create project DTO.
   * @return {Promise<IProjectTaskCreatePOJO>}
   */
  public createTask = (
    tenantId: number,
    projectId: number,
    taskDTO: ICreateTaskDTO
  ): Promise<IProjectTaskCreatePOJO> => {
    return this.createTaskService.createTask(tenantId, projectId, taskDTO);
  };

  /**
   * Edits details of the given task.
   * @param {number} tenantId - Tenant id.
   * @param {number} vendorId - Vendor id.
   * @param {IEditTaskDTO} projectDTO - Create project DTO.
   * @returns {Promise<IProjectTaskEditPOJO>}
   */
  public editTask = (
    tenantId: number,
    taskId: number,
    taskDTO: IEditTaskDTO
  ): Promise<IProjectTaskEditPOJO> => {
    return this.editTaskService.editTask(tenantId, taskId, taskDTO);
  };

  /**
   * Deletes the given task.
   * @param  {number} tenantId
   * @param  {number} taskId - Task id.
   * @return {Promise<void>}
   */
  public deleteTask = (tenantId: number, taskId: number): Promise<void> => {
    return this.deleteTaskService.deleteTask(tenantId, taskId);
  };

  /**
   * Retrieves the given task details.
   * @param {number} tenantId
   * @param {number} taskId
   * @returns {Promise<IProjectTaskGetPOJO>}
   */
  public getTask = (
    tenantId: number,
    taskId: number
  ): Promise<IProjectTaskGetPOJO> => {
    return this.getTaskService.getTask(tenantId, taskId);
  };

  /**
   * Retrieves the vendors paginated list.
   * @param {number} tenantId
   * @param {IVendorsFilter} filterDTO
   * @returns {Promise<IProjectTaskGetPOJO[]>}
   */
  public getTasks = (
    tenantId: number,
    projectId: number
  ): Promise<IProjectTaskGetPOJO[]> => {
    return this.getTasksService.getTasks(tenantId, projectId);
  };
}
