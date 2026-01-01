# github-actions

1️⃣ What is GitHub Actions?

GitHub Actions is a CI/CD automation tool used to:

Automatically test code

Build applications

Deploy projects
whenever an event happens in a GitHub repository.

📌 Used in real companies for DevOps automation.

2️⃣ Where GitHub Actions Files Are Stored

All GitHub Actions files are stored in:

.github/workflows/


Each file inside this folder is called a workflow.

3️⃣ Workflow
Definition:

A workflow is a YAML file that defines automation steps.

Key points:

Written in .yml

One repo can have multiple workflows

Each workflow has one main responsibility

Real-time workflow files:
File Name	Purpose
ci.yml	Run tests
build.yml	Build app
deploy.yml	Deploy app
lint.yml	Code quality
4️⃣ Events (on)
Definition:

Events define when the workflow runs.

Common real-time events:
Event	Usage
push	Code pushed
pull_request	PR created
workflow_dispatch	Manual trigger
schedule	Cron jobs
release	Deploy on release
Example:
on: push

5️⃣ Jobs
Definition:

A job is a set of steps executed on a runner.

Key points:

Each workflow has one or more jobs

Jobs run parallel by default

Example:
jobs:
  test:
    runs-on: ubuntu-latest

6️⃣ Runners (runs-on)
Definition:

A runner is the machine where the job runs.

Types:

ubuntu-latest (most used)

windows-latest

macos-latest

self-hosted

Example:
runs-on: ubuntu-latest

7️⃣ Steps
Definition:

Steps are individual tasks inside a job.

Real-time usage:

Checkout code

Install dependencies

Run tests

Build app

Example:
steps:
  - run: echo "Hello"

8️⃣ Actions (uses)
Definition:

Actions are reusable tools created by GitHub or the community.

Common real-time actions:
Action	Purpose
actions/checkout	Get code
actions/setup-node	Setup Node
actions/setup-python	Setup Python
actions/upload-artifact	Upload files
Example:
- uses: actions/checkout@v4

9️⃣ Commands (run)
Definition:

run executes shell commands.

Examples:
- run: npm install
- run: npm test


Multi-line:

- run: |
    npm install
    npm test

🔟 Environment Variables (env)
Definition:

Variables available during workflow execution.

Example:
env:
  NODE_ENV: production


Step-level:

- run: echo $NODE_ENV
  env:
    NODE_ENV: test

1️⃣1️⃣ Secrets
Definition:

Secure variables like passwords and API keys.

Stored in:

Repo → Settings → Secrets → Actions

Example:
env:
  API_KEY: ${{ secrets.API_KEY }}


⚠️ Secrets are never hardcoded.

1️⃣2️⃣ Job Dependency (needs)
Definition:

Controls execution order of jobs.

Real-time use:

Deploy only after tests pass

Example:
deploy:
  needs: test

1️⃣3️⃣ Artifacts
Definition:

Artifacts are files shared between jobs.

Real-time use:

Build output

Reports

Example:
- uses: actions/upload-artifact@v4
  with:
    name: build-files
    path: dist/

1️⃣4️⃣ Cache
Definition:

Cache speeds up workflows.

Real-time use:

npm cache

pip cache

Example:
- uses: actions/cache@v4

1️⃣5️⃣ Conditions (if)
Definition:

Runs jobs/steps only if condition is true.

Example:
if: github.ref == 'refs/heads/main'

1️⃣6️⃣ Matrix Strategy
Definition:

Run jobs with multiple configurations.

Real-time use:

Multiple Node versions

Example:
strategy:
  matrix:
    node: [16, 18, 20]

1️⃣7️⃣ Real-Time Workflow Flow

Developer pushes code

ci.yml runs tests

build.yml builds app

deploy.yml deploys app

1️⃣8️⃣ How Many Files Are Really Used?
Minimum:

1 workflow file

Real companies:

3–6 workflow files

Each file has one responsibility only.

1️⃣9️⃣ Common Mistakes

Wrong YAML indentation

Missing checkout

Wrong secret name

Wrong branch trigger

2️⃣0️⃣ Final Notes (IMPORTANT)

✔ Practice more than writing
✔ Read logs carefully
✔ Keep workflows simple
✔ One job = one responsibility
