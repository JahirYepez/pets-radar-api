import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/config/envs';

@Injectable()
export class CacheService {
    private readonly redis = this.createClient();

    private createClient(): Redis {
        const client = envs.REDIS_URL ? new Redis(envs.REDIS_URL) : new Redis({
            host: envs.REDIS_HOST,
            port: envs.REDIS_PORT,
            password: envs.REDIS_PASSWORD || undefined,
            tls: envs.REDIS_TLS ? {} : undefined
        });

        client.on("error", (error) => {
            console.error("[CacheService] Redis error:", error.message);
        });

        return client;
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redis.get(key);
            if (!data) return null;

            return JSON.parse(data) as T;
        } catch (error) {
            console.error("[CacheService] Error reading cache:", error);
            return null;
        }
    }

    async set(key: string, value: any) {
        try {
            const json = JSON.stringify(value);
            await this.redis.set(key, json);
        } catch (error) {
            console.error("[CacheService] Error writing cache:", error);
        }
    }

    async delete(key: string) {
        try {
            await this.redis.del(key);
        } catch (error) {
            console.error("[CacheService] Error deleting cache:", error);
        }
    }
}
