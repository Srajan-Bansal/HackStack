import { Kafka } from 'kafkajs';

const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'submission-webhook';

export const kafka = new Kafka({
	clientId: KAFKA_CLIENT_ID,
	brokers: [KAFKA_BROKER],
	retry: {
		initialRetryTime: 100,
		retries: 8,
	},
});

export const consumer = kafka.consumer({
	groupId: 'submission-consumer-group',
	sessionTimeout: 30000,
	heartbeatInterval: 3000,
});
