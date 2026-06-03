import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
      connectionString,
      max: 10,                    // Maximum pool size
      idleTimeoutMillis: 30000,   // Close idle connections after 30s
      connectionTimeoutMillis: 60000, // Fail connection attempt after 60s (increased for Neon cold start)
      keepAlive: true,            // Enable TCP keepalive
      keepAliveInitialDelayMillis: 10000, // Start keepalive after 10s
      ssl: {
        rejectUnauthorized: false, // Required for Neon and most cloud-hosted PG
      },
    });

    // Handle pool-level errors to prevent unhandled exceptions
    pool.on('error', (err) => {
      console.error('[PrismaService] Unexpected pool error:', err.message);
    });

    const adapter = new PrismaPg(pool);
    
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
