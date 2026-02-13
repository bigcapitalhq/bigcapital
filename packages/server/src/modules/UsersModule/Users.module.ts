import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
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
import { UserInvite } from './models/InviteUser.model';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { UsersApplication } from './Users.application';
import { GetUsersService } from './queries/GetUsers.service';
import { AcceptInviteUserService } from './commands/AcceptInviteUser.service';
import { InviteTenantUserService } from './commands/InviteUser.service';
import { UsersInviteController } from './UsersInvite.controller';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { SendInviteUserMailQueue } from './Users.constants';
import InviteSendMainNotificationSubscribe from './subscribers/InviteSendMailNotification.subscriber';
import { SendInviteUserMailProcessor } from './processors/SendInviteUserMail.processor';
import { SendInviteUsersMailMessage } from './commands/SendInviteUsersMailMessage.service';
import { MailModule } from '../Mail/Mail.module';

const models = [InjectSystemModel(UserInvite)];

@Module({
  imports: [
    TenancyModule,
    MailModule,
    BullModule.registerQueue({ name: SendInviteUserMailQueue }),
    BullBoardModule.forFeature({
      name: SendInviteUserMailQueue,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [...models],
  providers: [
    ...models,
    ActivateUserService,
    DeleteUserService,
    EditUserService,
    InactivateUserService,
    GetUserService,
    GetUsersService,
    AcceptInviteUserService,
    InviteTenantUserService,
    PurgeUserAbilityCacheSubscriber,
    SyncTenantUserDeleteSubscriber,
    SyncTenantUserMutateSubscriber,
    SyncSystemSendInviteSubscriber,
    SyncTenantAcceptInviteSubscriber,
    InviteSendMainNotificationSubscribe,
    SendInviteUserMailProcessor,
    SendInviteUsersMailMessage,
    UsersApplication
  ],
  controllers: [UsersController, UsersInviteController],
})
export class UsersModule {}
