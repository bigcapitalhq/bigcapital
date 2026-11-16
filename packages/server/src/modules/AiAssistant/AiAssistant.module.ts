import { Module } from '@nestjs/common';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { RolesModule } from '@/modules/Roles/Roles.module';
import { FinancialSheetCommonModule } from '@/modules/FinancialStatements/common/FinancialSheetCommon.module';
import { AiAssistantController } from './AiAssistant.controller';
import { AiConversationsController } from './AiConversations.controller';
import { AiAssistantService } from './AiAssistant.service';
import { AiConversationService } from './AiConversation.service';
import { AiAccessGuard } from './AiAccess.guard';
import { aiModelProvider } from './providers/ai-model.provider';

@Module({
  imports: [TenancyModule, RolesModule, FinancialSheetCommonModule],
  controllers: [AiAssistantController, AiConversationsController],
  providers: [
    AiAssistantService,
    AiConversationService,
    AiAccessGuard,
    aiModelProvider,
  ],
})
export class AiAssistantModule {}
