import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/config/envs';

@Injectable()
export class CacheService {
    private readonly redis = this.createClient();

    private createClient(): Redis {
        if (envs.REDIS_URL) {
            return new Redis(envs.REDIS_URL);
        }

        return new Redis({
            host: envs.REDIS_HOST,
            port: envs.REDIS_PORT,
            password: envs.REDIS_PASSWORD || undefined,
            tls: envs.REDIS_TLS ? {} : undefined
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        if (!data) return null;

        return JSON.parse(data) as T;
    }

    async set(key: string, value: any) {
        const json = JSON.stringify(value);
        await this.redis.set(key, json);
    }

    async delete(key: string) {
        await this.redis.del(key);
    }
}
