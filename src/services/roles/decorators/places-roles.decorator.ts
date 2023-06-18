import { SetMetadata } from '@nestjs/common';

export const PLACES_ROLES_KEY = 'employeeRoles';

export const PlacesRoles = (...roles: string[]) => SetMetadata(PLACES_ROLES_KEY, roles);
