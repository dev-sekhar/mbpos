// src/auth/roles.guard.ts

/**
 * RolesGuard
 *
 * Purpose:
 * - Protects routes by enforcing role-based access control (RBAC).
 * - Checks if the authenticated user has at least one of the required roles to access the endpoint.
 * - Uses metadata set by the @Roles() decorator to determine required roles.
 * - Logs detailed information about the user and roles for debugging purposes.
 */

import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.log('No roles required for this route, access granted.');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.debug(`User object from request: ${JSON.stringify(user)}`);

    if (!user) {
      this.logger.warn('Request user is undefined or null. Access denied.');
      return false;
    }

    if (!user.roles) {
      this.logger.warn('User roles property is missing. Access denied.');
      return false;
    }

    if (!Array.isArray(user.roles)) {
      this.logger.warn(`User roles is not an array. Actual value: ${user.roles}. Access denied.`);
      return false;
    }

    this.logger.log(`Required roles for this route: ${requiredRoles.join(', ')}`);
    this.logger.log(`User roles: ${user.roles.join(', ')}`);

    const hasRole = requiredRoles.some(role => user.roles.includes(role));

    if (!hasRole) {
      this.logger.warn('User does not have any of the required roles. Access denied.');
    } else {
      this.logger.log('User has required role(s). Access granted.');
    }

    return hasRole;
  }
}
