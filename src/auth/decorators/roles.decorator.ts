import { SetMetadata } from '@nestjs/common';

export enum Role {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
