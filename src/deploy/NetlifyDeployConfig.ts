import { NetlifyAPI } from 'netlify';

export const netlifyConfig = {
  timestamp: '2025-02-15 08:00:58',
  user: 'vilohitan',
  siteName: 'dspot-dating',
  deploymentSettings: {
    framework: 'react',
    buildCommand: 'npm run build',
    publishDirectory: 'build',
    nodeVersion: '18.x'
  }
};