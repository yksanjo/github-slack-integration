/**
 * GitHub Slack Integration
 * Main entry point
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { createEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/web-api';
import { logger } from './utils/logger';
import { githubWebhookHandler } from './handlers/github';
import { slackEventHandler } from './handlers/slack';
import { registerSlashCommands } from './routes/slash';

dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialize Slack clients
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || '');
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GitHub Webhook endpoint
app.post('/api/webhooks/github', githubWebhookHandler);

// Slack Events endpoint
app.use('/slack/events', slackEvents);

// Slash commands
registerSlashCommands(app);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`GitHub webhook URL: /api/webhooks/github`);
  logger.info(`Slack events URL: /slack/events`);
});

export { app, slackClient };
