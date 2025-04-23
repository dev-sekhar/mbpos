import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { TenantsService } from '../tenants/tenants.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host; // e.g. tenant1.example.com:3000
    if (!host) {
      return next();
    }

    const subdomain = host.split('.')[0];
    if (!subdomain) {
      return next();
    }

    try {
      const tenant = await this.tenantService.findBySubdomain(subdomain);
      (req as any).tenant = tenant;
    } catch (error) {
      // If tenant not found, you can choose to throw or just continue
      // throw new NotFoundException('Tenant not found');
      // Or silently continue without tenant attached
    }

    next();
  }
}
