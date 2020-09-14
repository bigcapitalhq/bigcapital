import { Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from 'subscribers/events';

@EventSubscriber()
export default class TenantManagerSubscriber {

  @On(events.tenantManager.databaseCreated)
  onDatabaseCreated() {

  }

  @On(events.tenantManager.tenantMigrated)
  onTenantMigrated() {

  }

  @On(events.tenantManager.tenantSeeded)
  onTenantSeeded() {

  }
}