export interface RolesFormPermission {
  subject: string;
  ability: string;
  value: boolean;
  permissionId?: number;
}

export interface RolesFormValues {
  roleName: string;
  roleDescription: string;
  permissions: Record<string, boolean>;
  serviceFullAccess: Record<string, boolean | number>;
}
