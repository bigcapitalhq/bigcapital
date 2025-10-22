import { CommandFactory } from 'nest-commander';
import { CLIModule } from './modules/CLI/CLI.module';

async function bootstrap() {
  await CommandFactory.run(CLIModule);
}

bootstrap();
