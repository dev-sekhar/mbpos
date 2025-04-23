// src/orders/orders.service.ts
// Purpose: Service with tenant-aware data access

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getOrdersForTenant(tenantId: number) {
    return this.prisma.order.findMany({
      where: { tenantId },
    });
  }
}
