# Playwright Enterprise Automation Framework

A runnable starter framework using **Playwright + TypeScript**, with UI and API examples.

## Included

- TypeScript with strict type checking
- Page Object Model (POM)
- Locator strategy prioritizes role, label, placeholder and visible text; CSS is used only where the demo app exposes no suitable accessible locator
- Reusable custom fixtures
- Authentication setup project and saved browser state
- Chromium, Firefox and WebKit projects
- UI tests for login, inventory, sorting and cart
- API tests with response/status/body validation
- Environment-based configuration (`.env`)
- HTML report, traces, screenshots and video on failure
- CI-friendly retries and worker configuration
- Test tags (`@smoke`) and npm scripts

## Prerequisites

- Node.js 20 or newer
- npm
- Internet access for browser installation and the demo applications

## Setup

1. Extract the ZIP.
2. Open a terminal in the extracted project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

   On Linux CI machines, use `npx playwright install --with-deps`.

5. Configure the files in the project root. They are ignored by Git, so create
   them locally if they are not present:

   - Copy `.credentials.example.json` to `.credentials.json`. Add accounts as
     objects with `username` and `password` fields. The object key becomes the
     user's key in `users`; adding an account does not require editing `env.ts`.
   - `.env.staging`, `.env.dev`, `.env.prod`: each contains `BASE_URL` and
     `API_BASE_URL` for that target.

   The current local files use the public SauceDemo and JSONPlaceholder
   endpoints. Replace those URLs with your actual endpoints when the targets
   differ. Keep real credentials out of Git.

## Run tests

Run the full suite (defaults to staging if `TEST_ENV` is not set):

```bash
npm test
```

Run the full suite against a specific target without setting `TEST_ENV` manually:

```bash
npm run test:dev
npm run test:staging
npm run test:prod
```

Run Chromium UI and API tests:

```bash
npm run test:ui
```

Run API tests only:

```bash
npm run test:api
```

Run headed:

```bash
npm run test:headed
```

Run smoke tests:

```bash
npm run test:smoke
```

### Select a test environment manually

The target-specific npm scripts above set `TEST_ENV` automatically. To run a
custom Playwright command, set `TEST_ENV` to `staging`, `dev`, or `prod`. The
selected `.env.<name>` file must define `BASE_URL` and `API_BASE_URL`. All test
account credentials live once in `.credentials.json` and are shared across
targets. Missing credentials or URLs stop test startup. Shell and CI values
take precedence; for a user key such as `lockedOut`, set `LOCKED_OUT_USERNAME`
and `LOCKED_OUT_PASSWORD`. Use protected CI secrets rather than committing
credentials.

PowerShell:

```powershell
$env:TEST_ENV = "staging"
npm test
Remove-Item Env:TEST_ENV
```

Replace `staging` with `dev` or `prod` to target the corresponding file. On
production, run only tests explicitly approved for that environment; avoid
tests that create, modify, or delete real customer data. Store CI credentials
as protected secrets rather than in the repository.

Type-check the project:

```bash
npm run typecheck
```

Open the HTML report:

```bash
npm run report
```

## Project structure

```text
playwright-enterprise-framework/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── src/
│   ├── config/env.ts
│   ├── fixtures/test.fixture.ts
│   └── pages/
│       ├── BasePage.ts
│       ├── LoginPage.ts
│       ├── InventoryPage.ts
│       └── CartPage.ts
├── tests/
│   ├── auth.setup.ts
│   ├── ui/
│   │   ├── login.spec.ts
│   │   └── inventory.spec.ts
│   └── api/
│       └── posts.spec.ts
└── playwright/.auth/
```

The local, Git-ignored configuration files are `.credentials.json`,
`.env.staging`, `.env.dev`, and `.env.prod`.

## Framework design notes

### Authentication

The `setup` project logs in once and saves browser storage state to
`playwright/.auth/user.json`. Browser projects depend on this setup project.
The auth file is generated at runtime and is intentionally excluded from Git.

The invalid-login test explicitly uses an empty storage state because it tests
the unauthenticated login flow.

### Page Object Model

Page classes contain page-specific locators and user actions. Assertions that
describe page state are kept close to the page object where useful; test-specific
business expectations remain in the spec files.

### Fixtures

`src/fixtures/test.fixture.ts` provides ready-to-use page objects to tests.
Add new fixtures there when a shared resource or helper has a clear lifecycle.

### API tests

The API examples use JSONPlaceholder as a public demonstration API. It is not
a production backend, and its POST endpoint simulates creation rather than
persisting data. The current API examples do not use authentication credentials.
If the target API requires authentication, keep its token in the selected
`.env.<name>` file or a protected CI secret, and pass it through the API client
rather than hardcoding it.

### Before using this for a real application

- Replace demo URLs and credentials with approved test-environment values.
- Never commit `.env`, passwords, tokens or generated auth state.
- Prefer accessible user-facing locators (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`). Use CSS locators only when the UI has no suitable accessible locator (for example, an unlabelled price span).
- Keep tests independent and avoid fixed sleeps.
- Add schema validation, API auth helpers, test-data builders and cleanup
  according to the application's actual API contracts.
- Tune workers/retries based on CI capacity; do not use retries to hide flaky tests.
- Confirm the target environment permits automated testing.

## Troubleshooting

- If browser binaries are missing: `npx playwright install`.
- If login fails, verify the demo site is reachable and credentials in
  `.credentials.json`.
- If a browser project fails but Chromium passes, check browser-specific support
  or whether the target site is temporarily unavailable.
- If TypeScript reports errors, run `npm run typecheck`.
