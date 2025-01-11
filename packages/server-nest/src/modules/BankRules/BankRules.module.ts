import { forwardRef, Module } from '@nestjs/common';
import { CreateBankRuleService } from './commands/CreateBankRule.service';
import { EditBankRuleService } from './commands/EditBankRule.service';
import { DeleteBankRuleService } from './commands/DeleteBankRule.service';
import { GetBankRulesService } from './queries/GetBankRules.service';
import { GetBankRuleService } from './queries/GetBankRule.service';
import { BankRulesApplication } from './BankRulesApplication';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { BankRuleCondition } from './models/BankRuleCondition';
import { BankRule } from './models/BankRule';
import { BankRulesController } from './BankRules.controller';
import { UnlinkBankRuleOnDeleteBankRuleSubscriber } from './events/UnlinkBankRuleOnDeleteBankRule';
import { DeleteBankRulesService } from './commands/DeleteBankRules.service';
import { BankingTransactionsRegonizeModule } from '../BankingTranasctionsRegonize/BankingTransactionsRegonize.module';

const models = [
  RegisterTenancyModel(BankRule),
  RegisterTenancyModel(BankRuleCondition),
];

@Module({
  controllers: [BankRulesController],
  imports: [forwardRef(() => BankingTransactionsRegonizeModule)],
  providers: [
    ...models,
    CreateBankRuleService,
    EditBankRuleService,
    DeleteBankRuleService,
    DeleteBankRulesService,
    GetBankRuleService,
    GetBankRulesService,
    BankRulesApplication,
    UnlinkBankRuleOnDeleteBankRuleSubscriber
  ],
  exports: [...models, DeleteBankRuleService, DeleteBankRulesService],
})
export class BankRulesModule {}
