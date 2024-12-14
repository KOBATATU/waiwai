# Local Development

## Introduction

Thank you for reviewing this document. This guide outlines the steps for local development and setup.

## Prerequisites

- You need to clone this repository
- Docker installation is required
- Node.js and pnpm installation is necessary
  - You can install pnpm with `npm install -g pnpm`
- GCP is required
  - However, it's not necessary unless you're uploading files

Once preparations are complete, execute the following for initial setup:

```bash
docker compose up
pnpm install
pnpm run prisma:generate
pnpm run prisma:migrate-dev
```

## env

```bash
# .env
DATABASE_URL="postgresql://user:postgres@127.0.0.1:5432/waiwai"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_SECRET=
TZ=Asia/Tokyo
PROJECT_ID=
GCS_APPLICATION_CREDENTIALS=
GCS_BUCKET=
WAIWAI_EVALUATE_API=http://localhost:8000
```

### Authentication

Authentication uses the `next-auth` library. For detailed setup instructions, please refer to [this guide](authentication).

### Object Storage

Object storage uses GCS (Google Cloud Storage). Currently, only GCP storage is supported. For detailed setup instructions, please refer to [this guide](gcp_storage).

## waiwai-evaluate

Set up the evaluation function API. Check the setup instructions in [this separate repository](https://github.com/KOBATATU/waiwai-evaluate).

## Startup

Run `pnpm run dev`

## User Permissions

Click on login and authenticate with GitHub. A user will be created. Only users with the `admin` role can create competitions.
To grant `admin` privileges, execute the following:

```bash
docker compose exec db bash
psql - U user -d waiwai
update public."User" set role='admin';
```

## Features

Competitions can be easily created from the `admin` header.

Upon creation, several configuration options will be displayed:

- overview
  - Describe the competition overview
- data
  - Describe the data overview for the competition. You can upload training data for users here, which participants can download.
- settings
  - title: Competition title
  - subtitle: Competition subtitle
  - number of submissions: Submission conditions
  - competition start date, competition end date: Competition period
  - competition evaluationFunc: Calculation metric
  - competition testDataRate: Percentage of answer data calculated publicly
  - competition open: Display to users
- completed
  - Finalize user submission data. Display private scores on the private leaderboard

Currently, `discussion` and `team member` merge features are not implemented. Only the basic structure exists.

## Answer Data

Refer to the `e2e` directory for examples. Answer data must have two columns:

- answer
  - Correct answer data
- is_public_score
  - Whether to calculate in public

Answer data must be placed in GCS. It should be located at `${competitionId}/answer/answer.csv`.

### submit data

Refer to the `e2e` directory for examples. Answer data must have one column only:

- expect
