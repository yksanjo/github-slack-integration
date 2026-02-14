/**
 * GitHub webhook handler
 */

import { Request, Response } from 'express';
import { WebClient } from '@slack/web-api';
import { logger } from '../utils/logger';
import { logger as slackLogger } from '../utils/logger';

// Slack client instance (will be initialized in index.ts)
let slackClient: WebClient;

export function setSlackClient(client: WebClient) {
  slackClient = client;
}

// Event type mappings
interface GitHubEventMap {
  push: typeof handlePush;
  pull_request: typeof handlePullRequest;
  issues: typeof handleIssues;
  deployment_status: typeof handleDeployment;
  release: typeof handleRelease;
  workflow_run: typeof handleWorkflow;
}

// Event handlers
async function handlePush(payload: any) {
  const { repository, commits, pusher } = payload;
  
  const message = {
    channel: '#deployments',
    text: `🚀 New push to ${repository.full_name}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🚀 New Push to ${repository.name}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Repository:*\n${repository.full_name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Pusher:*\n${pusher.name}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Commits:*\n${commits.length} commit(s) pushed`,
        },
      },
    ],
  };

  await slackClient.chat.postMessage(message);
  logger.info('Push notification sent');
}

async function handlePullRequest(payload: any) {
  const { action, pull_request, repository } = payload;
  const pr = pull_request;
  
  const statusEmoji = {
    opened: '🆕',
    closed: '❌',
    merged: '✅',
    reopened: '🔄',
  }[action] || '📝';

  const message = {
    channel: '#pr-reviews',
    text: `${statusEmoji} PR #${pr.number}: ${pr.title}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${statusEmoji} PR #${pr.number}: ${pr.title}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Author:*\n${pr.user.login}`,
          },
          {
            type: 'mrkdwn',
            text: `*Status:*\n${action}`,
          },
          {
            type: 'mrkdwn',
            text: `*Branch:*\n${pr.head.ref} → ${pr.base.ref}`,
          },
          {
            type: 'mrkdwn',
            text: `*Repository:*\n${repository.name}`,
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View PR',
            },
            url: pr.html_url,
          },
        ],
      },
    ],
  };

  await slackClient.chat.postMessage(message);
  logger.info(`PR notification sent for PR #${pr.number}`);
}

async function handleIssues(payload: any) {
  const { action, issue, repository } = payload;
  
  const message = {
    channel: '#issues',
    text: `📋 Issue #${issue.number}: ${issue.title}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📋 Issue #${issue.number}: ${issue.title}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Action:*\n${action}`,
          },
          {
            type: 'mrkdwn',
            text: `*Author:*\n${issue.user.login}`,
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Issue',
            },
            url: issue.html_url,
          },
        ],
      },
    ],
  };

  await slackClient.chat.postMessage(message);
}

async function handleDeployment(payload: any) {
  const { deployment, deployment_status, repository } = payload;
  
  const statusEmoji = {
    pending: '⏳',
    success: '✅',
    failure: '❌',
    error: '⚠️',
  }[deployment_status.state] || '📦';

  const message = {
    channel: '#deployments',
    text: `${statusEmoji} Deployment to ${deployment.environment}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${statusEmoji} Deployment to ${deployment.environment}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Repository:*\n${repository.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Status:*\n${deployment_status.state}`,
          },
          {
            type: 'mrkdwn',
            text: `*Branch:*\n${deployment.ref}`,
          },
          {
            type: 'mrkdwn',
            text: `*Description:*\n${deployment.description || 'N/A'}`,
          },
        ],
      },
    ],
  };

  await slackClient.chat.postMessage(message);
}

async function handleRelease(payload: any) {
  const { action, release, repository } = payload;
  
  const message = {
    channel: '#releases',
    text: `🎉 New release: ${release.tag_name}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🎉 New Release: ${release.tag_name}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: release.body || release.name || 'No description',
        },
      },
    ],
  };

  await slackClient.chat.postMessage(message);
}

async function handleWorkflow(payload: any) {
  const { action, workflow_run, repository } = payload;
  const run = workflow_run;
  
  if (action === 'completed') {
    const statusEmoji = run.conclusion === 'success' ? '✅' : '❌';
    
    const message = {
      channel: '#ci-cd',
      text: `${statusEmoji} Workflow ${run.name} ${run.conclusion}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${statusEmoji} Workflow ${run.name} ${run.conclusion}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Repository:*\n${repository.name}`,
            },
            {
              type: 'mrkdwn',
              text: `*Branch:*\n${run.head_branch}`,
            },
          ],
        },
      ],
    };

    await slackClient.chat.postMessage(message);
  }
}

// Main webhook handler
export async function githubWebhookHandler(req: Request, res: Response) {
  const event = req.headers['x-github-event'] as string;
  const payload = req.body;

  logger.info(`Received GitHub event: ${event}`);

  try {
    switch (event) {
      case 'push':
        await handlePush(payload);
        break;
      case 'pull_request':
        await handlePullRequest(payload);
        break;
      case 'issues':
        await handleIssues(payload);
        break;
      case 'deployment_status':
        await handleDeployment(payload);
        break;
      case 'release':
        await handleRelease(payload);
        break;
      case 'workflow_run':
        await handleWorkflow(payload);
        break;
      default:
        logger.info(`Unhandled event type: ${event}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error handling GitHub webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
