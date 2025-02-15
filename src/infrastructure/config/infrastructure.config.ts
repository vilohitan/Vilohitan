import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env') });

export const infrastructureConfig = {
  timestamp: '2025-02-15 07:47:39',
  user: 'vilohitan',
  environment: process.env.NODE_ENV || 'development',
  
  kubernetes: {
    namespace: 'dating-app',
    regions: ['us-east-1', 'eu-west-1', 'ap-south-1'],
    minReplicas: 3,
    maxReplicas: 10,
    targetCPUUtilization: 70
  },

  database: {
    mongodb: {
      uri: process.env.MONGODB_URI,
      replicaSet: true,
      minConnections: 5,
      maxConnections: 100
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      clusters: ['cache', 'session', 'queue']
    },
    elasticsearch: {
      nodes: process.env.ELASTICSEARCH_NODES?.split(','),
      indices: ['users', 'matches', 'messages', 'analytics']
    }
  },

  storage: {
    minio: {
      endpoint: process.env.MINIO_ENDPOINT,
      buckets: {
        media: 'user-media',
        backup: 'system-backup',
        temp: 'temp-storage'
      }
    }
  },

  monitoring: {
    prometheus: {
      port: 9090,
      scrapeInterval: '15s',
      evaluationInterval: '15s'
    },
    grafana: {
      port: 3000,
      dashboards: ['system', 'business', 'security']
    }
  }
};