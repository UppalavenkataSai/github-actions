# FreeCodes In Telugu — GitHub Actions Day 5 + Day 6 (100% Free Learning Lab)

A beginner-friendly GitHub Actions lab covering:
- Branch strategy, Pull Requests, branch rules and CODEOWNERS
- CI quality gates: pytest + Ruff
- Security: Bandit (Python SAST), pip-audit (dependency audit), Gitleaks (secret scan), Trivy (filesystem + container scan)
- CycloneDX SBOM
- GitHub Environments: staging and production
- Environment variables vs secrets, least-privilege `GITHUB_TOKEN`
- Manual release, artifact promotion, checksum verification, concurrency and rollback concepts

## Free-only setup
Use a **public GitHub repository** and GitHub-hosted Ubuntu runners. All scanning/testing tools in this lab are free/open-source. No paid scanner, paid cloud service, AWS account, or deployment credential is needed.

GitHub plan features can change. This lab does not depend on CodeQL, GitHub Advanced Security, paid marketplace scanners, or a real cloud deployment. Environment approval controls are demonstrated through repository Environment settings where available for public repositories.

## Local requirements
- Python 3.11+
- Git
- Optional: Docker Engine / Docker Desktop (free for eligible personal, educational and small-business use under Docker's terms; see Docker licensing before organizational use)

## Run locally
```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

python -m pip install -r requirements.txt
python -m pytest -q
python -m ruff check .
python -m bandit -r src
python -m pip_audit -r requirements.txt
```
For local Gitleaks and Trivy, install their free CLI releases from their official project documentation. The GitHub workflow installs/runs them in the hosted runner.

## Upload to GitHub
Create a **public** repository. Extract this ZIP, then run:
```bash
git init
git add .
git commit -m "Add free Day 5 and Day 6 CI/CD lab"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Day 5: Quality gates and release controls
1. Create `feature/demo-change` branch.
2. Make a small code change and push it.
3. Open a Pull Request to `main`.
4. Check the CI and security jobs.
5. In Settings → Rules → Rulesets (or Branches), configure a PR requirement and require `CI / quality`.
6. In Settings → Environments, create `staging` and `production`.
7. Add a non-sensitive variable `DEPLOY_REGION` to each environment if desired.
8. Add required reviewers to `production` if the option is available for your repository plan.
9. Run Actions → `Free Controlled Release`; select staging or production.

## Day 6: DevSecOps
- Bandit: Python source-code security checks (SAST-style).
- pip-audit: known vulnerabilities in Python packages (dependency/SCA check).
- Gitleaks: detects likely secrets in Git history.
- Trivy: scans repository files/configuration and the built container image.
- CycloneDX: generates an SBOM inventory.

A scanner finding should be investigated. Do not disable a security gate just to get a green build. If a real secret is exposed, revoke/rotate it immediately.

## What is intentionally a placeholder?
The deploy steps only print messages. This keeps the lab genuinely free and safe: it does not create AWS/Azure resources or need cloud credentials. Students learn the release gates and same-artifact promotion first.

## Security and production notes
- `permissions: contents: read` is the starting permission.
- Add only required token permissions for a real deployment.
- Never expose secrets to untrusted fork PR code.
- Pin third-party actions to verified full commit SHAs before production.
- For AWS deployment, prefer OIDC federation and a narrowly scoped IAM role over long-lived access keys.
- A YAML `if` condition is not an approval gate. Configure reviewers in Environment settings.
- For container production, promote the same immutable image digest from staging to production; do not rebuild separately.
