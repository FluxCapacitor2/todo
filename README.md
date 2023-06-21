# `todo`

A simple todo app built with Next.js, Prisma, tRPC, and TailwindCSS.

## Features

Each user can have multiple projects. Each project has multiple sections, and each section can have many tasks.

- Sign in with GitHub
- Due dates
- Start dates
  - Set a start date to have an automatic "expected progress" bar for your task
- Rich Markdown task descriptions
- Infinitely nested sub-tasks
- Runs as a Progressive Web App
  - Can be added to a device's home screen
- Reminder notifications
- Frequent polling to keep the UI up-to-date

## Development

```sh
npm run dev
```

## Environment

```env
# GitHub login
GITHUB_ID=
GITHUB_SECRET=

# Firebase information (for FCM)
FIREBASE_API_KEY=
FIREBASE_APP_ID=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=

# The service account should be JSON credentials encoded as Base64
FIREBASE_SERVICE_ACCOUNT=

# MySQL database connection string
DATABASE_URL=

# The base URL of the app (must be HTTPS for many PWA features to work)
NEXT_PUBLIC_BASE_URL=
NEXTAUTH_URL=

# Whether to log Prisma's SQL queries
LOG_QUERIES=true
```
