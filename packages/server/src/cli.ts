// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./common/types/Objection.d.ts" />
import { CommandFactory } from 'nest-commander';
import { CLIModule } from './modules/CLI/CLI.module';

async function bootstrap() {
  await CommandFactory.run(CLIModule);
}

bootstrap();
