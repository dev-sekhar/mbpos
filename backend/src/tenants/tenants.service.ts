// src/tenants/tenants.service.ts
// Purpose: Service to manage tenant-related operations including registration and lookup by subdomain

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterTenantDto } from './dto/register-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  // Register a new tenant with main branch and admin employee
  async registerTenant(dto: RegisterTenantDto) {
    // Check if subdomain is already taken
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { subdomain: dto.subdomain },
    });
    if (existingTenant) {
      throw new ConflictException('Subdomain already in use');
    }

    // Hash the admin password securely
    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    // 1. Create the tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        subdomain: dto.subdomain,
      },
    });

    // 2. Create the main branch for this tenant
    const branch = await this.prisma.branch.create({
      data: {
        name: 'Main Branch',
        isMain: true,
        tenantId: tenant.id,
      },
    });

    // 3. Create the admin employee for this branch and tenant
    const employee = await this.prisma.employee.create({
      data: {
        name: dto.adminName,
        email: dto.adminEmail,
        password: hashedPassword,
        role: 'TENANT_ADMIN',
        tenantId: tenant.id,
        branchId: branch.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return a summary object
    return {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
      branch: {
        id: branch.id,
        name: branch.name,
        isMain: branch.isMain,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      },
      admin: employee,
    };
  }

  // Find tenant by subdomain (used by tenant middleware)
  async findBySubdomain(subdomain: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { subdomain },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with subdomain '${subdomain}' not found`);
    }
    return tenant;
  }
}
