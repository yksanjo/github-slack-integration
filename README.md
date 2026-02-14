# 💬 GitHub Slack Integration

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-20+-green" alt="Node.js">
</p>

> Real-time GitHub to Slack notifications and workflow automation

A comprehensive integration between GitHub and Slack that provides real-time notifications, workflow automation, and team collaboration features. Built with TypeScript, Node.js, and Slack's Block Kit.

## ✨ Features

- **Real-time Notifications** - Get instant alerts for PRs, issues, deployments
- **Customizable Alerts** - Filter by repository, event type, author
- **Rich Message Format** - Beautiful Slack messages with Block Kit
- **Workflow Automation** - Trigger Slack actions from GitHub events
- **Slash Commands** - Query GitHub directly from Slack
- **Threaded Discussions** - Continue conversations in Slack threads
- **Multi-workspace Support** - Connect multiple Slack workspaces
- **Deployment Alerts** - Track deployments in real-time

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: Redis (for caching & queues)
- **Messaging**: Slack Web API, Block Kit
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Slack Workspace with admin access
- GitHub repository

### Installation

```bash
# Clone the repository
git clone https://github.com/yksanjo/github-slack-integration.git
cd github-slack-integration

# Install dependencies
npm install

# Configure environment
cp .env```

### Configuration

.example .env
```env
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token

# GitHub Configuration
GITHUB_WEBHOOK_SECRET=your-webhook-secret
GITHUB_TOKEN=your-github-token

# Server Configuration
PORT=3000
REDIS_URL=redis://localhost:6379
```

### Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Slack App Setup

1. Create a new Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable the following OAuth scopes:
   - `chat:write`
   - `channels:read`
   - `users:read`
   - `reactions:write`
   - `commands`
3. Enable Event Subscriptions and subscribe to:
   - `message.channels`
   - `reaction_added`
4. Install the app to your workspace

### GitHub Webhook Setup

1. Go to your repository → Settings → Webhooks
2. Add a new webhook:
   - Payload URL: `https://your-server.com/api/webhooks/github`
   - Events: Select events you want to notify
   - Secret: Your webhook secret

## 📱 Supported Events

### GitHub Events → Slack Notifications

| GitHub Event | Slack Notification |
|--------------|-------------------|
| Push | Commit details with diff summary |
| Pull Request | PR opened/merged/closed with reviewers |
| Issue | New issue or comment |
| Deployment | Deployment status (pending/success/failed) |
| Release | New release published |
| Security Alert | Vulnerability alert |
| CI/CD | Workflow run status |

### Slack Commands

| Command | Description |
|---------|-------------|
| `/github status` | Check GitHub status |
| `/github prs` | List open PRs |
| `/github issues` | List recent issues |
| `/github deploy` | Trigger deployment |
| `/github search <query>` | Search repositories |

## 🔌 Webhook Events Configuration

```javascript
// Example webhook payload mapping
const eventMapping = {
  push: {
    channel: '#deployments',
    template: 'commit'
  },
  pull_request: {
    channel: '#pr-reviews',
    template: 'pr'
  },
  issues: {
    channel: '#issues',
    template: 'issue'
  },
  deployment_status: {
    channel: '#deployments',
    template: 'deployment'
  }
};
```

## 📁 Project Structure

```
github-slack-integration/
├── src/
│   ├── config/           # Configuration
│   ├── handlers/        # Event handlers
│   ├── slack/           # Slack API client
│   ├── github/          # GitHub API client
│   ├── routes/          # Express routes
│   ├── middleware/      # Express middleware
│   └── utils/           # Utilities
├── tests/               # Test suite
├── scripts/             # Utility scripts
└── package.json
```

## 🤖 Bot Commands

The integration includes a Slack bot that can:

- Post deployment status updates
- Create threads for PR discussions
- Add reactions to messages
- Send daily/weekly summaries
- Notify on-call teams

## 📊 Message Templates

### Pull Request

```
📝 PR #123: Feature: Add new dashboard
👤 Author: @username
🔄 Status: Open | Merged | Closed
📋 Reviewers: @reviewer1, @reviewer2
🔗 URL: github.com/...
```

### Deployment

```
🚀 Deployment to Production
📦 Service: api-service
🌳 Branch: main
👤 By: @username
⏱️ Duration: 5m 32s
✅ Status: Success | Failed
```

## 🔧 Advanced Configuration

### Custom Filters

```javascript
const filters = {
  // Only notify for main branch
  branch: 'main',
  
  // Exclude certain paths
  excludePaths: ['docs/**', '*.md'],
  
  // Filter by author
  excludeAuthors: ['dependabot[bot]'],
  
  // Custom conditions
  conditions: {
    minFilesChanged: 5,
    hasBreakingChanges: true
  }
};
```

### Message Customization

```javascript
const messageConfig = {
  // Enable/disable features
  includeDiff: true,
  includeBuildStatus: true,
  includeChecks: true,
  
  // Custom formatting
  maxDiffLines: 50,
  showFileTree: true,
  
  // Threading
  threadOnPR: true,
  threadOnIssue: false
};
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

Built by [Yoshikondo](https://github.com/yksanjo)

---

<div align="center">

⭐ Star us on GitHub | 🔔 Subscribe to updates | 💼 [LinkedIn](https://linkedin.com/in/yksanjo)

</div>
