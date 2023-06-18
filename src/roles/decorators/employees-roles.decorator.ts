import { SetMetadata } from '@nestjs/common';

export const EMPLOYEES_ROLES_KEY = 'roles';

export const EmployeesRoles = (...roles: string[]) =>
  SetMetadata(EMPLOYEES_ROLES_KEY, roles);
