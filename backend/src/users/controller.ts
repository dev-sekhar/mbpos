// src/users/users.controller.ts
// Purpose: Controller to manage user-related endpoints with authentication and RBAC

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protect all routes with JWT and roles
export class UsersController {

  @Get('profile')
  @Roles('TENANT_ADMIN', 'MANAGER', 'STAFF') // Roles allowed to access this route
  getProfile(@Req() req) {
    // req.user is populated by JwtStrategy validate method
    return {
      message: 'User profile data',
      user: req.user,
    };
  }

  @Get()
  @Roles('TENANT_ADMIN', 'MANAGER') // Only admins and managers can list users
  findAll() {
    return 'List of users (protected)';
  }
}
