import { Module } from '@nestjs/common';
import { GetResourceViewsService } from './GetResourceViews.service';
import { ViewsController } from './Views.controller';
import { ResourceModule } from '../Resource/Resource.module';

@Module({
  imports: [ResourceModule],
  controllers: [ViewsController],
  providers: [GetResourceViewsService],
})
export class ViewsModule {}
