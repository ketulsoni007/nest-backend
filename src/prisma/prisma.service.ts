import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(){
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL
        });
        super({
            adapter,
            log: process.env.NODE_ENV === 'development' ? ['query','error', 'warn'] : ['error']
        })
    }

    async onModuleInit() {
        await this.$connect();
        console.log('Prisma connected to the database');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('Prisma disconnected from the database');
    }

    async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Cleaning the production database is not allowed.');
    }

    const models = Reflect.ownKeys(this).filter(
        (key): key is string =>
            typeof key === 'string' && !key.startsWith('_'),
    );

    return Promise.all(
        models.map((modelName) => {
            const model = (this as any)[modelName];

            return model.deleteMany();
        }),
    );
}}