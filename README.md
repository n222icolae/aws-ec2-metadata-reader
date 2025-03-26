# AWS EC2 Metadata Reader

## Overview

TypeScript utility for retrieving EC2 instance metadata.

## Features

- Fetch all available EC2 instance metadata
- Retrieve specific metadata keys
- Containerization

## Prerequisites

- Node.js 22.x
- AWS EC2 instance + ssh access
- Docker (optional, for containerized usage)

## Installation

### Local Installation

1. Clone the repository:
```bash
git clone https://github.com/n222icolae/aws-ec2-metadata-reader.git
cd aws-ec2-metadata-reader
```

2. Install dependencies:
```bash
npm i
```

### Docker Installation

```bash
docker build -t aws-ec2-metadata-reader .
```

## Usage

### Command Line

Fetch All Metadata

```bash
npm run start
```

Fetch Specific Metadata

```bash
npm run start -- instance-id
npm run start -- placement/availability-zone
```

Works with jq

```bash
npm run start -- | jq
```

### Docker

```bash
docker run --rm aws-ec2-metadata-reader
```

```bash
docker run aws-ec2-metadata-reader public-hostname
```

### Programmatic Usage

```typescript
import { getMetadata } from './src/service/ec2-metadata';

async function example() {
    // Fetch all metadata
    const allMetadata = await getMetadata();
    console.log(allMetadata);

    // Fetch specific metadata
    const instanceId = await getMetadata('instance-id');
    console.log(instanceId);
}
```

## Supported Metadata Keys

The utility supports all standard EC2 metadata keys, such as:
- `instance-id`
- `public-hostname`
- `public-ipv4`
- `local-hostname`
- `local-ipv4`
- `placement/availability-zone`
- `network/interfaces/macs`
- And more...

## Security Considerations

- Works only within EC2 instances
- Uses IMDSv2 with session-oriented tokens

## Troubleshooting

- Ensure you're running on an EC2 instance
- Check network connectivity to metadata service
- Verify AWS IAM permissions
