export interface RolesFormPermission {
  subject: string;
  ability: string;
  value: boolean;
}

export interface RolesFormValues {
  role_name: string;
  role_description: string;
  permissions: Record<string, boolean>;
  serviceFullAccess: Record<string, boolean | number>;
}
