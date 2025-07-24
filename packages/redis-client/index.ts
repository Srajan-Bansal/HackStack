import { createClient, RedisClientType } from 'redis';

const redis = createClient({
	url: process.env.REDIS_URL || 'redis://localhost:6379',
	database: parseInt(process.env.REDIS_DB ?? '1'),
});

redis.on('error', (err) => console.error('Redis Error:', err));

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
	if (!isConnected && !connectionPromise) {
		connectionPromise = redis.connect().then(() => {
			isConnected = true;
		});
	}

	if (connectionPromise) {
		await connectionPromise;
	}

	return redis as RedisClientType;
};

export default redis;
