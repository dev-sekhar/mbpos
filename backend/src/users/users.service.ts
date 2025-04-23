//Module that encapsulates order-related controllers and services.

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}


async findByEmail(email: string) {
    if (!email) throw new Error('Email is required');
    return this.prisma.employee.findUnique({
      where: { email },
    });
  }
  

  async findById(id: number) {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }
}
