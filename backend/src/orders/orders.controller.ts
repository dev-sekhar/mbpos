// src/orders/orders.controller.ts
// Purpose: Controller demonstrating tenant-aware service usage

import { Controller, Get } from '@nestjs/common';
import { Tenant } from '../common/decorators/tenant.decorator';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async getOrders(@Tenant() tenant) {
    return this.ordersService.getOrdersForTenant(tenant.id);
  }
}
