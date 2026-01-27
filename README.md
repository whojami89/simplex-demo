## UI & API test framework project (DEMO)

This repository contains a demo version of automated tests for simplex.com (UI) and Silius API platform (API) using Playwright and Typescript.

### Tech stack:
- **Framework:** Playwright
- **Language:** Typescript
- **CI/CD:** Github Actions
- **Containerization:** Docker support

### Prerequisites

Before start ensure you have the following installed on your machine:
- Node.js (Tested on `v24.13.0`)
- npm (Tested on `v11.6.2`)
- Playwright `v1.58.0`

### Setup & Installation:
1. **Clone the repository:**
```bash
git clone git@github.com:whojami89/simplex-demo.git
cd simplex-demo
```
2. **Install dependencies:**
```bash
npm ci
```
3. **Install Playwright browsers:**
```bash
# Installs Chromium (standard for this project) and required system deps
npx playwright install chromium --with-deps
```
4. **Set environment variables:**\
Copy the example environment `.env_example` file and adjust values if necessary. Otherwise, the default settings will be used.

### Running tests:
**Local execution:**
```bash
# Runs all tests in headless mode
npx playwright test

# Runs only API tests
npx playwright test tests/api

# Runs only e2e tests
npx playwright test tests/e2e
```
Note: to run tests in headed mode (to see the browser) parameter `--headed` need to be added. For debugging need to be used `--ui` parameter.

### CI/CD Integration
This project uses GitHub Actions for continuous integration.
* **Triggers**: Runs on every push to main/master and on pull_request.
* **Manual Run**: The workflow can be triggered manually via the "Run workflow" button in the Actions tab (workflow_dispatch).

### Docker support
Project contains dockerfile, so that tests can be executed in isolated environment using official Playwright image.

```bash
docker build -t playwright-tests .
docker run --rm --env-file .env playwright-tests
```

### Reporting
* After running tests locally, use `npx playwright show-report` to view the detailed HTML results (with attached video/screenshots in case of failure).
* After running tests through GitHub Actions, the report can also be downloaded for viewing in browser.

### Additional notes
* The project utilizes the open to use Sylius API platform endpoints, specifically from the "Taxon" section: https://v2.demo.sylius.com/api/v2#/Taxon . This page serves as both documentation and an interactive environment for executing requests. Accessing these endpoints **requires authorization**. To perform requests, a JWT token must first be retrieved by executing the corresponding security request via the https://v2.demo.sylius.com/api/v2#/Security/postAdministratorCredentialsItem
* Default settings are configured to work out of the box, but you can override them using the .env file for custom configurations.