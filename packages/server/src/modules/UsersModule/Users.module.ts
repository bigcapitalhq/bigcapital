import { Module } from '@nestjs/common';
import { ActivateUserService } from './commands/ActivateUser.service';
import { DeleteUserService } from './commands/DeleteUser.service';
import { EditUserService } from './commands/EditUser.service';
import { InactivateUserService } from './commands/InactivateUser.service';
import { GetUserService } from './queries/GetUser.service';
import { PurgeUserAbilityCacheSubscriber } from './subscribers/PurgeUserAbilityCache.subscriber';
import { SyncTenantUserDeleteSubscriber } from './subscribers/SyncTenantUserDeleted.subscriber';
import { SyncTenantUserMutateSubscriber } from './subscribers/SyncTenantUserSaved.subscriber';
import { SyncSystemSendInviteSubscriber } from './subscribers/SyncSystemSendInvite.subscriber';
import { SyncTenantAcceptInviteSubscriber } from './subscribers/SyncTenantAcceptInvite.subscriber';
import { UsersController } from './Users.controller';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { UserInvite } from './models/InviteUser.model';

const models = [RegisterTenancyModel(UserInvite)];

@Module({
  imports: [...models],
  exports: [...models],
  providers: [
    ActivateUserService,
    DeleteUserService,
    EditUserService,
    InactivateUserService,
    GetUserService,
    PurgeUserAbilityCacheSubscriber,
    SyncTenantUserDeleteSubscriber,
    SyncTenantUserMutateSubscriber,
    SyncSystemSendInviteSubscriber,
    SyncTenantAcceptInviteSubscriber,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
