import { Inject, Service } from 'typedi';
import { CreateTimeService } from './CreateTime';
import { EditTimeService } from './EditTime';
import { GetTimelineService } from './GetTimes';
import { GetTimeService } from './GetTime';
import { DeleteTimeService } from './DeleteTime';
import {
  IProjectTimeCreateDTO,
  IProjectTimeCreatePOJO,
  IProjectTimeEditDTO,
  IProjectTimeEditPOJO,
  IProjectTimeGetPOJO,
} from '@/interfaces';

@Service()
export class TimesApplication {
  @Inject()
  private createTimeService: CreateTimeService;

  @Inject()
  private editTimeService: EditTimeService;

  @Inject()
  private deleteTimeService: DeleteTimeService;

  @Inject()
  private getTimeService: GetTimeService;

  @Inject()
  private getTimelineService: GetTimelineService;

  /**
   * Creates a new time for specific project's task.
   * @param  {number} tenantId - Tenant id.
   * @param  {IProjectTimeCreateDTO} timeDTO - Create project's time DTO.
   * @return {Promise<IProjectTimeCreatePOJO>}
   */
  public createTime = (
    tenantId: number,
    taskId: number,
    timeDTO: IProjectTimeCreateDTO
  ): Promise<IProjectTimeCreatePOJO> => {
    return this.createTimeService.createTime(tenantId, taskId, timeDTO);
  };

  /**
   * Edits details of the given task.
   * @param {number} tenantId - Tenant id.
   * @param {number} vendorId - Vendor id.
   * @param {IProjectCreateDTO} projectDTO - Create project DTO.
   * @returns {Promise<IProjectTimeEditPOJO>}
   */
  public editTime = (
    tenantId: number,
    timeId: number,
    taskDTO: IProjectTimeEditDTO
  ): Promise<IProjectTimeEditPOJO> => {
    return this.editTimeService.editTime(tenantId, timeId, taskDTO);
  };

  /**
   * Deletes the given task.
   * @param {number} tenantId
   * @param {number} taskId
   * @return {Promise<void>}
   */
  public deleteTime = (tenantId: number, timeId: number): Promise<void> => {
    return this.deleteTimeService.deleteTime(tenantId, timeId);
  };

  /**
   * Retrieves the given task details.
   * @param {number} tenantId
   * @param {number} timeId
   * @returns {Promise<IProjectTimeGetPOJO>}
   */
  public getTime = (
    tenantId: number,
    timeId: number
  ): Promise<IProjectTimeGetPOJO> => {
    return this.getTimeService.getTime(tenantId, timeId);
  };

  /**
   * Retrieves the vendors paginated list.
   * @param {number} tenantId
   * @param {IVendorsFilter} filterDTO
   * @returns {Promise<IProjectTimeGetPOJO[]>}
   */
  public getTimeline = (
    tenantId: number,
    projectId: number
  ): Promise<IProjectTimeGetPOJO[]> => {
    return this.getTimelineService.getTimeline(tenantId, projectId);
  };
}
