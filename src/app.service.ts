import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        message: 'Database connected successfully',
        database: 'connected',
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        database: 'disconnected',
      };
    }
  }
}