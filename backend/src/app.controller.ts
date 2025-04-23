// src/app.controller.ts
// Purpose: Controller to test tenant context from middleware

import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get('tenant-info')
  getTenantInfo(@Req() req: Request) {
    return {
      tenant: (req as any).tenant || null,
      host: req.headers.host,
    };
  }
}
