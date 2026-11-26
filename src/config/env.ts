import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';

const supportedEnvironments = ['staging', 'dev', 'prod'] as const;
const selectedEnvironment =
  process.env.TEST_ENV?.trim().toLowerCase() || 'staging';

if (
  !supportedEnvironments.some((environment) => environment === selectedEnvironment)
) {
  throw new Error(
    `Unsupported TEST_ENV "${selectedEnvironment}". Choose staging, dev, or prod.`
  );
}

const inheritedEnvironment = { ...process.env };
const credentialsFile = '.credentials.json';
const envFile = `.env.${selectedEnvironment}`;
const dotenvResult = dotenv.config({ path: envFile });

if (dotenvResult.error) {
  throw new Error(`Could not load ${envFile}; create it before running tests.`);
}

const getValue = (name: string): string | undefined =>
  inheritedEnvironment[name] ?? process.env[name];

const getRequiredValue = (name: string, sourceFile = envFile): string => {
  const value = getValue(name);
  if (!value) {
    throw new Error(
      `Missing ${name}; set it in ${sourceFile} or provide it through the environment.`
    );
  }
  return value;
};

type UserCredentials = {
  username: string;
  password: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parsedCredentials: unknown = JSON.parse(
  readFileSync(credentialsFile, 'utf8')
);

if (
  !isRecord(parsedCredentials) ||
  Object.keys(parsedCredentials).length === 0
) {
  throw new Error(`${credentialsFile} must contain a non-empty object of users.`);
}

const getCredential = (name: string, fallback: string): string => {
  const value = getValue(name) ?? fallback;
  if (!value) {
    throw new Error(
      `Missing ${name}; set it in ${credentialsFile} or provide it through the environment.`
    );
  }
  return value;
};

const users: Record<string, UserCredentials> = {};

for (const [userKey, value] of Object.entries(parsedCredentials)) {
  if (
    !/^[a-z][A-Za-z0-9]*$/.test(userKey) ||
    !isRecord(value) ||
    typeof value.username !== 'string' ||
    typeof value.password !== 'string'
  ) {
    throw new Error(
      `Invalid user "${userKey}" in ${credentialsFile}; each user needs a lower-camel-case name and string username/password values.`
    );
  }

  const environmentPrefix = userKey
    .replace(/[A-Z]/g, (letter) => `_${letter}`)
    .toUpperCase();

  users[userKey] = {
    username: getCredential(`${environmentPrefix}_USERNAME`, value.username),
    password: getCredential(`${environmentPrefix}_PASSWORD`, value.password),
  };
}

export const env = {
  target: selectedEnvironment,
  baseURL: getRequiredValue('BASE_URL'),
  apiBaseURL: getRequiredValue('API_BASE_URL'),
  users,
};
