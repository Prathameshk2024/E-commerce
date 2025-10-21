import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// Handle Redis connection errors
redis.on('error', (err) => {
    console.log('Redis connection error:', err.message);
});

redis.on('connect', () => {
    console.log('✅ Connected to Redis');
});

// Test connection
try {
    await redis.set('foo', 'bar');
    console.log('✅ Redis test successful');
} catch (error) {
    console.log('⚠️ Redis test failed:', error.message);
}