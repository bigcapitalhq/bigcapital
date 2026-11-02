import { Module } from '@nestjs/common';
import { defineServerExtension } from '@bigcapital/extension-sdk/server';
import { exampleReportsManifest } from '../manifest';
import { revenueByCustomerReport } from './RevenueByCustomerReport';

@Module({})
class ExampleReportsModule {}

export const extension = defineServerExtension({
  manifest: exampleReportsManifest,
  createModule: (ctx) => {
    ctx.bridges.reports.register(revenueByCustomerReport);

    return { module: ExampleReportsModule };
  },
});
