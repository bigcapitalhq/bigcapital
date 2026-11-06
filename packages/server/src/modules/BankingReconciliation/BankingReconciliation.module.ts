import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { BankReconciliation } from './models/BankReconciliation';
import { BankReconciliationTransaction } from './models/BankReconciliationTransaction';
import { BankingReconciliationController } from './BankingReconciliation.controller';
import { BankingReconciliationApplication } from './BankingReconciliationApplication.service';
import { BankingReconciliationRepository } from './queries/BankingReconciliationRepository';
import { GetBankReconciliationsService } from './queries/GetBankReconciliations.service';
import { GetBankReconciliationService } from './queries/GetBankReconciliation.service';
import { CreateBankReconciliationService } from './commands/CreateBankReconciliation.service';
import { UpdateBankReconciliationService } from './commands/UpdateBankReconciliation.service';
import { FinishBankReconciliationService } from './commands/FinishBankReconciliation.service';
import { UndoBankReconciliationService } from './commands/UndoBankReconciliation.service';
import { DeleteBankReconciliationService } from './commands/DeleteBankReconciliation.service';
import { BankReconciliationValidator } from './commands/BankReconciliationValidator.service';

const models = [
  RegisterTenancyModel(BankReconciliation),
  RegisterTenancyModel(BankReconciliationTransaction),
];

@Module({
  imports: [TenancyModule, ...models],
  controllers: [BankingReconciliationController],
  providers: [
    BankingReconciliationRepository,
    BankReconciliationValidator,
    GetBankReconciliationsService,
    GetBankReconciliationService,
    CreateBankReconciliationService,
    UpdateBankReconciliationService,
    FinishBankReconciliationService,
    UndoBankReconciliationService,
    DeleteBankReconciliationService,
    BankingReconciliationApplication,
  ],
  exports: [...models],
})
export class BankingReconciliationModule {}
