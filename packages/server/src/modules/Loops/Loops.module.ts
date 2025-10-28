import { Module } from '@nestjs/common';
import { LoopsEventsSubscriber } from './LoopsEvents.subscriber';

@Module({
  providers: [LoopsEventsSubscriber],
})
export class LoopsModule {}
