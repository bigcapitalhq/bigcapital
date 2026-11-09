import { IOrganizationBuildDTO } from '@/modules/Organization/Organization.types';

export interface IWorkspaceCreatedEventPayload {
  tenantId: number;
  organizationId: string;
  userId: number;
  buildDTO: IOrganizationBuildDTO;
}

export const DeleteWorkspaceQueue = 'delete-workspace';

export interface DeleteWorkspaceQueueJobPayload {
  organizationId: string;
  userId: number;
}

export interface IWorkspaceSetDefaultEventPayload {
  tenantId: number;
  organizationId: string;
  userId: number;
}
