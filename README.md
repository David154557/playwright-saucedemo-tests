# SauceDemo E2E Tests

End-to-end tests for [saucedemo.com](https://www.saucedemo.com) written with
[Playwright](https://playwright.dev) and TypeScript, using the Page Object Model.

## What is covered

| Spec | Test |
| --- | --- |
| `tests/login.spec.ts` | Successful login with valid credentials |
| `tests/login.spec.ts` | Login fails with a wrong password |
| `tests/login.spec.ts` | `locked_out_user` sees the "locked out" error |
| `tests/checkout.spec.ts` | Add a product to the cart and complete checkout |

Every test runs on **Chromium, Firefox and WebKit**.

## Project structure

```
.
├── pages/                    # Page Objects – one class per screen
│   ├── LoginPage.ts          # Login form and error message
│   ├── InventoryPage.ts      # Product list, add to cart, cart badge
│   ├── CartPage.ts           # Cart contents and Checkout button
│   └── CheckoutPage.ts       # Checkout info form, overview, confirmation
├── tests/                    # Test specs – use Page Objects, contain assertions
│   ├── login.spec.ts
│   └── checkout.spec.ts
├── playwright.config.ts      # Base URL, browsers, trace/screenshot settings
└── package.json
```

### Page Object Model

Each class in `pages/` wraps one screen of the site. It exposes:

- **Locators** as `readonly` properties (e.g. `loginPage.errorMessage`), so tests can assert on them.
- **Actions** as async methods (e.g. `loginPage.login(user, password)`), so tests read as user steps.

Selectors live only in the Page Objects. If the site's markup changes, you update one class
instead of every test.

Locators use `getByTestId()`. SauceDemo marks its elements with a `data-test` attribute, so
`playwright.config.ts` sets `testIdAttribute: 'data-test'`.

## Configuration highlights

`playwright.config.ts`:

- `baseURL: 'https://www.saucedemo.com'` – tests navigate with relative paths (`page.goto('/')`).
- `trace: 'on'` and `screenshot: 'on'` – a trace and a final screenshot are saved for **every**
  test, passing or failing.
- `projects` – `chromium`, `firefox` and `webkit`.

## Getting started

Requirements: [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npx playwright install        # download the browsers
```

## Running the tests

```bash
npx playwright test                       # all tests, all browsers
npx playwright test --project=chromium    # one browser only
npx playwright test tests/login.spec.ts   # one spec file
npx playwright test -g "locked out"       # tests whose title matches
npx playwright test --headed              # watch the browser
npx playwright test --ui                  # interactive UI mode
npx playwright test --debug               # step through with the inspector
```

## Reports, traces and screenshots

After a run:

```bash
npx playwright show-report
```

This opens the HTML report. Each test's entry links to its screenshot and trace.

Raw artifacts are written to `test-results/<test-name>-<browser>/`:

- `trace.zip` – open with `npx playwright show-trace <path-to-trace.zip>` to replay the test
  step by step, with DOM snapshots, network and console logs.
- `test-finished-1.png` – the screenshot taken at the end of the test.

`test-results/` and `playwright-report/` are git-ignored and are replaced on every run.

## Test data

SauceDemo is a public demo site. All users share the password `secret_sauce`:

| Username | Used for |
| --- | --- |
| `standard_user` | Successful login, checkout |
| `locked_out_user` | Locked-out error |
