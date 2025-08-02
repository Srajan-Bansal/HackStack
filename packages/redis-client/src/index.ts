import { createClient, RedisClientType } from 'redis';

class RedisClient {
	private client: RedisClientType;
	private isConnected = false;
	private connectionPromise: Promise<void> | null = null;
	private retryCount = 0;
	private maxRetries = 3;
	private shouldRetry = true;

	private static instance: RedisClient;

	private constructor() {
		const defaultUrl =
			process.env.DOCKER_ENV === 'true'
				? 'redis://hackstack-redis:6379'
				: 'redis://localhost:6379';

		this.client = createClient({
			url: process.env.REDIS_URL || defaultUrl,
			database: parseInt(process.env.REDIS_DB ?? '1'),
		});

		this.client.on('error', (err) => {
			this.retryCount++;
			if (this.retryCount >= this.maxRetries) {
				console.warn(
					'Redis connection failed after',
					this.maxRetries,
					'attempts. Running without cache.'
				);
				this.shouldRetry = false;
			} else {
				console.log(
					`Redis connection attempt ${this.retryCount}/${this.maxRetries} failed. Retrying...`
				);
			}
		});

		this.client.on('connect', () => {
			console.log('✅ Redis Client Connected:', this.client.options?.url);
		});
	}

	public static getInstance(): RedisClient {
		if (!RedisClient.instance) {
			RedisClient.instance = new RedisClient();
		}
		return RedisClient.instance;
	}

	public async connect(): Promise<void> {
		if (!this.shouldRetry) return;

		if (!this.isConnected && !this.connectionPromise) {
			this.connectionPromise = this.client
				.connect()
				.then(() => {
					this.isConnected = true;
					this.retryCount = 0;
				})
				.catch((err) => {
					if (this.retryCount >= this.maxRetries) {
						this.shouldRetry = false;
					}
					throw err;
				});
		}

		if (this.connectionPromise) {
			try {
				await this.connectionPromise;
			} catch {
				// fail silently after max retries
			}
		}
	}

	public async disconnect(): Promise<void> {
		if (this.isConnected) {
			await this.client.disconnect();
			this.isConnected = false;
			this.connectionPromise = null;
		}
	}

	public getClient(): RedisClientType | null {
		if (!this.isConnected || !this.shouldRetry) return null;
		return this.client;
	}
}

const redisClient = RedisClient.getInstance();
if (process.env.NODE_ENV !== 'test') {
	redisClient.connect().catch(console.error);
}

export const getRedisClient = async (): Promise<RedisClientType | null> => {
	await redisClient.connect();
	return redisClient.getClient();
};

export const disconnectRedis = async (): Promise<void> => {
	await redisClient.disconnect();
};

export default redisClient;
