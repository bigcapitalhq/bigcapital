import { ApiProperty } from '@nestjs/swagger';

/**
 * Users and invitations API error types.
 * These error types are returned when user or invitation operations fail.
 */
export enum UsersErrorType {
  /** Cannot delete the last user in the system */
  CannotDeleteLastUser = 'CANNOT_DELETE_LAST_USER',

  /** The user is already active */
  UserAlreadyActive = 'USER_ALREADY_ACTIVE',

  /** The user is already inactive */
  UserAlreadyInactive = 'USER_ALREADY_INACTIVE',

  /** The email already exists */
  EmailAlreadyExists = 'EMAIL_ALREADY_EXISTS',

  /** The phone number already exists */
  PhoneNumberAlreadyExist = 'PHONE_NUMBER_ALREADY_EXIST',

  /** The user was not found */
  UserNotFound = 'USER_NOT_FOUND',

  /** The user cannot activate or inactivate their own account */
  UserSameTheAuthorizedUser = 'USER_SAME_THE_AUTHORIZED_USER',

  /** The user cannot change their own role */
  CannotAuthorizedUserMutateRole = 'CANNOT_AUTHORIZED_USER_MUTATE_ROLE',

  /** The email is already invited */
  EmailAlreadyInvited = 'EMAIL_ALREADY_INVITED',

  /** The invitation token is invalid */
  InviteTokenInvalid = 'INVITE_TOKEN_INVALID',

  /** The phone number already exists */
  PhoneNumberExists = 'PHONE_NUMBER_EXISTS',

  /** The email already exists (invitations) */
  EmailExists = 'EMAIL_EXISTS',

  /** The email does not exist */
  EmailNotExists = 'EMAIL_NOT_EXISTS',

  /** The user was recently invited */
  UserRecentlyInvited = 'USER_RECENTLY_INVITED',

  /** The authorized user is not allowed to grant the assigned role */
  CannotGrantRole = 'CANNOT_GRANT_ROLE',

  /** The change would remove the last active admin */
  CannotRemoveLastAdmin = 'CANNOT_REMOVE_LAST_ADMIN',

  /** The assigned role was not found */
  RoleNotFound = 'ROLE_NOT_FOUND',
}

/**
 * Users API error response
 * Returned when a user or invitation operation fails
 */
export class UsersErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type identifier',
    enum: UsersErrorType,
    example: UsersErrorType.CannotGrantRole,
  })
  type: UsersErrorType;

  @ApiProperty({
    description: 'Human-readable error message',
    required: false,
    nullable: true,
  })
  message: string | null;

  @ApiProperty({
    description: 'Additional error payload data',
    required: false,
    nullable: true,
  })
  payload: any;
}

/**
 * Users API error response wrapper.
 */
export class UsersApiErrorResponseDto {
  @ApiProperty({
    description: 'Array of error details',
    type: [UsersErrorResponseDto],
  })
  errors: UsersErrorResponseDto[];
}
