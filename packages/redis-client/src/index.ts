import { createClient, RedisClientType } from 'redis';

class RedisClient {
	private client: RedisClientType;
	private isConnected = false;
	private connectionPromise: Promise<void> | null = null;

	constructor() {
		this.client = createClient({
			url: process.env.REDIS_URL || 'redis://localhost:6379',
			database: parseInt(process.env.REDIS_DB ?? '1'),
		});

		this.client.on('error', (err) => {
			console.error('Redis Client Error:', err);
		});

		this.client.on('connect', () => {
			console.log('Redis Client Connected');
		});
	}

	async connect(): Promise<void> {
		if (!this.isConnected && !this.connectionPromise) {
			this.connectionPromise = this.client.connect().then(() => {
				this.isConnected = true;
			});
		}

		if (this.connectionPromise) {
			await this.connectionPromise;
		}
	}

	async disconnect(): Promise<void> {
		if (this.isConnected) {
			await this.client.disconnect();
			this.isConnected = false;
			this.connectionPromise = null;
		}
	}

	getClient(): RedisClientType {
		if (!this.isConnected) {
			throw new Error('Redis client is not connected. Call connect() first.');
		}
		return this.client;
	}
}

// Singleton instance
const redisClient = new RedisClient();

// Auto-connect in non-test environments
if (process.env.NODE_ENV !== 'test') {
	redisClient.connect().catch(console.error);
}

export const getRedisClient = async (): Promise<RedisClientType> => {
	await redisClient.connect();
	return redisClient.getClient();
};

export const disconnectRedis = async (): Promise<void> => {
	await redisClient.disconnect();
};

export default redisClient;