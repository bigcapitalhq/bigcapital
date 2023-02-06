import { IBranch, ICreateBranchDTO, IEditBranchDTO } from '@/interfaces';
import { Service, Inject } from 'typedi';
import { ActivateBranches } from './ActivateBranches';
import { CreateBranch } from './CreateBranch';
import { DeleteBranch } from './DeleteBranch';
import { EditBranch } from './EditBranch';
import { GetBranch } from './GetBranch';
import { GetBranches } from './GetBranches';
import { MarkBranchAsPrimary } from './MarkBranchAsPrimary';

@Service()
export class BranchesApplication {
  @Inject()
  private deleteBranchService: DeleteBranch;

  @Inject()
  private createBranchService: CreateBranch;

  @Inject()
  private getBranchService: GetBranch;

  @Inject()
  private editBranchService: EditBranch;

  @Inject()
  private getBranchesService: GetBranches;

  @Inject()
  private activateBranchesService: ActivateBranches;

  @Inject()
  private markBranchAsPrimaryService: MarkBranchAsPrimary;

  /**
   * Retrieves branches list.
   * @param   {number} tenantId
   * @returns {IBranch}
   */
  public getBranches = (tenantId: number): Promise<IBranch[]> => {
    return this.getBranchesService.getBranches(tenantId);
  };

  /**
   * Retrieves the given branch details.
   * @param   {number} tenantId - Tenant id.
   * @param   {number} branchId - Branch id.
   * @returns {Promise<IBranch>}
   */
  public getBranch = (tenantId: number, branchId: number): Promise<IBranch> => {
    return this.getBranchService.getBranch(tenantId, branchId);
  };

  /**
   * Creates a new branch.
   * @param   {number} tenantId -
   * @param   {ICreateBranchDTO} createBranchDTO
   * @returns {Promise<IBranch>}
   */
  public createBranch = (
    tenantId: number,
    createBranchDTO: ICreateBranchDTO
  ): Promise<IBranch> => {
    return this.createBranchService.createBranch(tenantId, createBranchDTO);
  };

  /**
   * Edits the given branch.
   * @param   {number} tenantId - Tenant id.
   * @param   {number} branchId - Branch id.
   * @param   {IEditBranchDTO} editBranchDTO - Edit branch DTO.
   * @returns {Promise<IBranch>}
   */
  public editBranch = (
    tenantId: number,
    branchId: number,
    editBranchDTO: IEditBranchDTO
  ): Promise<IBranch> => {
    return this.editBranchService.editBranch(tenantId, branchId, editBranchDTO);
  };

  /**
   * Deletes the given branch.
   * @param   {number} tenantId - Tenant id.
   * @param   {number} branchId - Branch id.
   * @returns {Promise<void>}
   */
  public deleteBranch = (tenantId: number, branchId: number): Promise<void> => {
    return this.deleteBranchService.deleteBranch(tenantId, branchId);
  };

  /**
   * Activates the given branches.
   * @param   {number} tenantId - Tenant id.
   * @returns {Promise<void>}
   */
  public activateBranches = (tenantId: number): Promise<void> => {
    return this.activateBranchesService.activateBranches(tenantId);
  };

  /**
   * Marks the given branch as primary.
   * @param   {number} tenantId
   * @param   {number} branchId
   * @returns {Promise<IBranch>}
   */
  public markBranchAsPrimary = async (
    tenantId: number,
    branchId: number
  ): Promise<IBranch> => {
    return this.markBranchAsPrimaryService.markAsPrimary(tenantId, branchId);
  };
}
