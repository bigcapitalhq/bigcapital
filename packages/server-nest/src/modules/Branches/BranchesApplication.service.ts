import { ICreateBranchDTO, IEditBranchDTO } from './Branches.types';
import { ActivateBranches } from './commands/ActivateBranchesFeature.service';
import {
  CreateBranchService,
} from './commands/CreateBranch.service';
import {
  DeleteBranchService,
} from './commands/DeleteBranch.service';
import { EditBranchService } from './commands/EditBranch.service';
import { GetBranchService } from './queries/GetBranch.service';
import { GetBranchesService } from './queries/GetBranches.service';
import { MarkBranchAsPrimaryService } from './commands/MarkBranchAsPrimary.service';
import { Branch } from './models/Branch.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BranchesApplication {
  constructor(
    private readonly createBranchService: CreateBranchService,
    private readonly editBranchService: EditBranchService,
    private readonly deleteBranchService: DeleteBranchService,
    private readonly getBranchService: GetBranchService,
    private readonly getBranchesService: GetBranchesService,
    private readonly activateBranchesService: ActivateBranches,
    private readonly markBranchAsPrimaryService: MarkBranchAsPrimaryService,
  ) {}

  /**
   * Retrieves branches list.
   * @param   {number} tenantId
   * @returns {IBranch}
   */
  public getBranches = (): Promise<Branch[]> => {
    return this.getBranchesService.getBranches();
  };

  /**
   * Retrieves the given branch details.
   * @param {number} branchId - Branch id.
   * @returns {Promise<IBranch>}
   */
  public getBranch = (branchId: number): Promise<Branch> => {
    return this.getBranchService.getBranch(branchId);
  };

  /**
   * Creates a new branch.
   * @param {number} tenantId -
   * @param {ICreateBranchDTO} createBranchDTO
   * @returns {Promise<IBranch>}
   */
  public createBranch = (
    createBranchDTO: ICreateBranchDTO,
  ): Promise<Branch> => {
    return this.createBranchService.createBranch(createBranchDTO);
  };

  /**
   * Edits the given branch.
   * @param {number} branchId - Branch id.
   * @param {IEditBranchDTO} editBranchDTO - Edit branch DTO.
   * @returns {Promise<Branch>}
   */
  public editBranch = (
    branchId: number,
    editBranchDTO: IEditBranchDTO,
  ): Promise<Branch> => {
    return this.editBranchService.editBranch(branchId, editBranchDTO);
  };

  /**
   * Deletes the given branch.
   * @param {number} branchId - Branch id.
   * @returns {Promise<void>}
   */
  public deleteBranch = (branchId: number): Promise<void> => {
    return this.deleteBranchService.deleteBranch(branchId);
  };

  /**
   * Activates the given branches.
   * @returns {Promise<void>}
   */
  public activateBranches = (): Promise<void> => {
    return this.activateBranchesService.activateBranches();
  };

  /**
   * Marks the given branch as primary.
   * @param   {number} tenantId
   * @param   {number} branchId
   * @returns {Promise<IBranch>}
   */
  public markBranchAsPrimary = async (
    branchId: number,
  ): Promise<Branch> => {
    return this.markBranchAsPrimaryService.markAsPrimary(branchId);
  };
}
