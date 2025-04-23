//Define REST endpoint /tenants/register.
import { Controller, Post, Body } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('register')
  async register(@Body() dto: RegisterTenantDto) {
    return this.tenantsService.registerTenant(dto);
  }
}
