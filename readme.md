# HackStack

A competitive programming platform for coding challenges, contests, and skill building.

## Architecture

<img width="4902" height="2617" alt="HackStack Architecture" src="https://github.com/user-attachments/assets/dd3ec65c-3dff-43ee-adce-235de062ab6a" />

## Repository Structure

This is the parent repository that ties together all HackStack services as git submodules:

| Repository | Description |
|-----------|-------------|
| [HackStack-monorepo](https://github.com/Srajan-Bansal/HackStack-monorepo) | Turborepo monorepo — React frontend, Express backend, submission webhook |
| [hackstack-problems](https://github.com/Srajan-Bansal/hackstack-problems) | Problem definitions, test cases, and boilerplate code |
| [OpenExecutor](https://github.com/Srajan-Bansal/OpenExecutor) | Spring Boot code execution engine |

## Tech Stack

- **Frontend:** React + TypeScript + Vite + TailwindCSS + Monaco Editor
- **Backend:** Express + TypeScript + Prisma (PostgreSQL)
- **Execution Engine:** Spring Boot + Java
- **Message Queue:** Apache Kafka
- **Caching:** Redis
- **Runtime & Package Manager:** Bun
- **Monorepo:** Turborepo + Bun workspaces

## Getting Started

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/Srajan-Bansal/HackStack.git

# If already cloned without submodules
git submodule update --init --recursive
```

### Infrastructure

```bash
# Redis
docker run -d --name hackstack-redis -p 6379:6379 redis:alpine

# Kafka (KRaft mode)
docker run -d --name hackstack-kafka -p 9092:9092 apache/kafka:3.7.1
```

### Kafka Topics

```bash
# Access Kafka container
docker exec -it hackstack-kafka /bin/bash
cd /opt/kafka/bin

# Create required topics
./kafka-topics.sh --create --topic code-executor --bootstrap-server localhost:9092
./kafka-topics.sh --create --topic code-results --bootstrap-server localhost:9092

# List topics
./kafka-topics.sh --list --bootstrap-server localhost:9092
```

### Development

```bash
# Install dependencies
cd HackStack-monorepo
bun install

# Start all services
bun dev
```

See individual repository READMEs for detailed setup instructions.
