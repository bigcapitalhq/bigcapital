import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { ITenantUserEditedPayload } from '../Users.types';
import { EditUserDto } from '../dtos/EditUser.dto';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../Users.constants';
import { ModelObject } from 'objection';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { Role } from '@/modules/Roles/models/Role.model';
import { getAbilityForRole } from '@/modules/Roles/TenantAbilities';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  validateAbilityCanAssignRole,
  validateTenantOwnerMutation,
} from '../Users.utils';

@Injectable()
export class EditUserService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

    @Inject(Role.name)
    private readonly roleModel: TenantModelProxy<typeof Role>,
  ) {}

  /**
   * Creates a new user.
   * @param {number} userId - User id.
   * @param {IUserDTO} editUserDTO - Edit user DTO.
   * @return {Promise<ISystemUser>}
   */
  public async editUser(
    userId: number,
    editUserDTO: EditUserDto,
  ): Promise<any> {
    const authorizedUser = await this.tenancyContext.getSystemUser();

    // Retrieve the tenant user or throw not found service error.
    const oldTenantUser = await this.tenantUserModel()
      .query()
      .findById(userId)
      .throwIfNotFound();

    // The tenant user email is synced into the system user identity which is
    // used to sign in and to reset the password across all the workspaces, so
    // it is only mutable by the user themselves.
    const isAuthorizedUser = authorizedUser?.id === oldTenantUser.systemUserId;
    const email = isAuthorizedUser ? editUserDTO.email : oldTenantUser.email;

    // Retrieve the authorized tenant user with the role permissions.
    const authorizedTenantUser = await this.tenantUserModel()
      .query()
      .findOne({ systemUserId: authorizedUser.id })
      .withGraphFetched('role.permissions');

    // Validate cannot mutate the authorized user.
    this.validateMutateRoleNotAuthorizedUser(
      oldTenantUser,
      editUserDTO,
      authorizedUser,
    );
    // Validate the workspace owner cannot be mutated by another user.
    await validateTenantOwnerMutation(
      oldTenantUser,
      authorizedTenantUser,
      this.userTenantModel,
      this.tenancyContext,
    );
    // Validate the user is not mutating another user's login email.
    this.validateMutateEmailNotAuthorizedUser(
      oldTenantUser,
      editUserDTO,
      authorizedUser,
    );
    // Validate the authorized user can assign the selected role.
    await this.validateRoleAssignable(
      oldTenantUser,
      editUserDTO,
      authorizedTenantUser,
    );

    // Validate user email should be unique.
    await this.validateUserEmailUniquiness(email, userId);

    // Updates the tenant user.
    const tenantUser = await this.tenantUserModel()
      .query()
      .updateAndFetchById(userId, {
        firstName: editUserDTO.firstName,
        lastName: editUserDTO.lastName,
        email,
        roleId: editUserDTO.roleId,
      });
    // Triggers `onTenantUserEdited` event.
    await this.eventEmitter.emitAsync(events.tenantUser.onEdited, {
      userId,
      editUserDTO,
      tenantUser,
      oldTenantUser,
    } as ITenantUserEditedPayload);

    return tenantUser;
  }

  /**
   * Validate the given user email should be unique in the storage.
   * @param {string} email - User email.
   * @param {number} userId - User id.
   */
  async validateUserEmailUniquiness(email: string, userId: number) {
    const userByEmail = await this.tenantUserModel()
      .query()
      .findOne('email', email)
      .whereNot('id', userId);

    if (userByEmail) {
      throw new ServiceError(ERRORS.EMAIL_ALREADY_EXISTS);
    }
  }

  /**
   * Validate the authorized user cannot mutate its role.
   * @param {ITenantUser} oldTenantUser - Old tenant user.
   * @param {IEditUserDTO} editUserDTO - Edit user dto.
   * @param {ISystemUser} authorizedUser - Authorized user.
   */
  validateMutateRoleNotAuthorizedUser(
    oldTenantUser: ModelObject<TenantUser>,
    editUserDTO: EditUserDto,
    authorizedUser: ModelObject<SystemUser>,
  ) {
    if (
      authorizedUser.id === oldTenantUser.systemUserId &&
      editUserDTO.roleId !== oldTenantUser.roleId
    ) {
      throw new ServiceError(ERRORS.CANNOT_AUTHORIZED_USER_MUTATE_ROLE);
    }
  }

  /**
   * Validate the authorized user is not mutating another user login email.
   * The tenant user email is synced into the system user identity which is
   * used to sign in and to reset the password across all the workspaces, so
   * it should only ever be changed by the user themselves.
   * @param {ITenantUser} oldTenantUser - Old tenant user.
   * @param {IEditUserDTO} editUserDTO - Edit user dto.
   * @param {ISystemUser} authorizedUser - Authorized user.
   */
  validateMutateEmailNotAuthorizedUser(
    oldTenantUser: ModelObject<TenantUser>,
    editUserDTO: EditUserDto,
    authorizedUser: ModelObject<SystemUser>,
  ) {
    const isAuthorizedUser = authorizedUser?.id === oldTenantUser.systemUserId;
    const isEmailChanged =
      this.normalizeEmail(editUserDTO.email) !==
      this.normalizeEmail(oldTenantUser.email);

    if (!isAuthorizedUser && isEmailChanged) {
      throw new ServiceError(
        ERRORS.CANNOT_MUTATE_OTHER_USER_EMAIL,
        'You cannot change another user email address.',
        null,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Validate the authorized user can assign the selected role, the role
   * should not carry more privileges than the authorized user abilities.
   * @param {ITenantUser} oldTenantUser - Old tenant user.
   * @param {IEditUserDTO} editUserDTO - Edit user dto.
   * @param {ITenantUser} authorizedTenantUser - Authorized tenant user.
   */
  async validateRoleAssignable(
    oldTenantUser: ModelObject<TenantUser>,
    editUserDTO: EditUserDto,
    authorizedTenantUser: ModelObject<TenantUser> | null | undefined,
  ) {
    const isRoleChanged = editUserDTO.roleId !== oldTenantUser.roleId;

    if (!isRoleChanged || !authorizedTenantUser?.role) {
      return;
    }
    const role = await this.roleModel()
      .query()
      .findById(editUserDTO.roleId)
      .withGraphFetched('permissions');

    if (!role) {
      throw new ServiceError(
        ERRORS.ROLE_NOT_FOUND,
        'The given role not found.',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
    validateAbilityCanAssignRole(
      getAbilityForRole(authorizedTenantUser.role),
      role,
    );
  }

  /**
   * Normalizes the given email address to a lower-case trimmed string.
   * @param {string} email
   * @returns {string}
   */
  private normalizeEmail(email?: string): string {
    return String(email ?? '')
      .trim()
      .toLowerCase();
  }
}
