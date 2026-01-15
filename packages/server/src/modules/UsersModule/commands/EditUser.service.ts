import { Inject, Injectable } from '@nestjs/common';
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
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class EditUserService {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,
  ) { }

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
    const { email } = editUserDTO;
    const authorizedUser = await this.tenancyContext.getSystemUser();

    // Retrieve the tenant user or throw not found service error.
    const oldTenantUser = await this.tenantUserModel()
      .query()
      .findById(userId)
      .throwIfNotFound();

    // Validate cannot mutate the authorized user.
    this.validateMutateRoleNotAuthorizedUser(
      oldTenantUser,
      editUserDTO,
      authorizedUser,
    );
    // Validate user email should be unique.
    await this.validateUserEmailUniquiness(email, userId);

    // Updates the tenant user.
    const tenantUser = await this.tenantUserModel()
      .query()
      .updateAndFetchById(userId, {
        firstName: editUserDTO.firstName,
        lastName: editUserDTO.lastName,
        email: editUserDTO.email,
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
}
