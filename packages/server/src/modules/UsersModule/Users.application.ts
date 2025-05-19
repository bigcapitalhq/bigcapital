import { Injectable } from '@nestjs/common';
import { ActivateUserService } from './commands/ActivateUser.service';
import { DeleteUserService } from './commands/DeleteUser.service';
import { EditUserService } from './commands/EditUser.service';
import { InactivateUserService } from './commands/InactivateUser.service';
import { GetUserService } from './queries/GetUser.service';
import { AcceptInviteUserService } from './commands/AcceptInviteUser.service';
import { EditUserDto } from './dtos/EditUser.dto';
import { InviteUserDto } from './dtos/InviteUser.dto';
import { GetUsersService } from './queries/GetUsers.service';
import { InviteTenantUserService } from './commands/InviteUser.service';
import { IUserSendInviteDTO } from './Users.types';

@Injectable()
export class UsersApplication {
  constructor(
    private readonly activateUserService: ActivateUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly editUserService: EditUserService,
    private readonly inactivateUserService: InactivateUserService,
    private readonly getUserService: GetUserService,
    private readonly getUsersService: GetUsersService,
    private readonly acceptInviteUserService: AcceptInviteUserService,
    private readonly inviteservice: InviteTenantUserService,
  ) {}

  /**
   * Activates a user.
   * @param {number} userId - User ID to activate.
   * @returns {Promise<void>}
   */
  async activateUser(userId: number): Promise<void> {
    return this.activateUserService.activateUser(userId);
  }

  /**
   * Inactivates a user.
   * @param {number} tenantId - Tenant ID.
   * @param {number} userId - User ID to inactivate.
   * @param {ModelObject<TenantUser>} authorizedUser - The user performing the action.
   * @returns {Promise<void>}
   */
  async inactivateUser(userId: number): Promise<void> {
    return this.inactivateUserService.inactivateUser(userId);
  }

  /**
   * Edits a user's details.
   * @param {number} userId - User ID to edit.
   * @param {IEditUserDTO} editUserDTO - User data to update.
   * @returns {Promise<void>}
   */
  async editUser(userId: number, editUserDTO: EditUserDto): Promise<void> {
    return this.editUserService.editUser(userId, editUserDTO);
  }

  /**
   * Deletes a user (soft delete).
   * @param {number} tenantId - Tenant ID.
   * @param {number} userId - User ID to delete.
   * @returns {Promise<void>}
   */
  async deleteUser(userId: number): Promise<void> {
    return this.deleteUserService.deleteUser(userId);
  }

  /**
   * Gets a user by ID.
   * @param {number} userId - User ID to retrieve.
   * @returns {Promise<any>} User details.
   */
  async getUser(userId: number): Promise<any> {
    return this.getUserService.getUser(userId);
  }

  /**
   * Gets users list based on the given filter.
   */
  async getUsers() {
    return this.getUsersService.getUsers();
  }

  /**
   * Accepts a user invitation.
   * @param {string} token - Invitation token.
   * @param {IInviteUserInput} inviteUserDTO - User data for accepting the invitation.
   * @returns {Promise<void>}
   */
  async acceptInvite(
    token: string,
    inviteUserDTO: InviteUserDto,
  ): Promise<void> {
    return this.acceptInviteUserService.acceptInvite(token, inviteUserDTO);
  }

  /**
   * Checks if an invitation token is valid.
   * @param {string} token - Invitation token to validate.
   * @returns {Promise<{ inviteToken: any; orgName: string }>} Invitation details.
   */
  async checkInvite(
    token: string,
  ): Promise<{ inviteToken: any; orgName: string }> {
    return this.acceptInviteUserService.checkInvite(token);
  }
  /**
   * Sends an invitation to a new user.
   * @param {IUserSendInviteDTO} sendInviteDTO - User invitation data.
   * @returns {Promise<{ invitedUser: ITenantUser }>} The invited user details.
   */
  async sendInvite(sendInviteDTO: IUserSendInviteDTO) {
    return this.inviteservice.sendInvite(sendInviteDTO);
  }

  /**
   * Resends an invitation to an existing user.
   * @param {number} userId - ID of the user to resend invitation to.
   * @returns {Promise<{ user: ITenantUser }>} The user details.
   */
  async resendInvite(userId: number) {
    return this.inviteservice.resendInvite(userId);
  }
}
