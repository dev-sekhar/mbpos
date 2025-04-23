// src/dashboard/dashboard.controller.ts

/**
 * DashboardController
 *
 * Purpose:
 * - Exposes the /dashboard endpoint, protected by JWT authentication and role-based access control.
 * - Only users with the TENANT_ADMIN role can access this endpoint.
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard) // AuthGuard runs first, then RolesGuard
export class DashboardController {
  @Get()
  @Roles('TENANT_ADMIN')
  getDashboard() {
    return { message: 'Welcome to the tenant dashboard!' };
  }
}
