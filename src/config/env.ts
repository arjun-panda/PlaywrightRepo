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
const credentialsFile = '.env.credentials';
const envFile = `.env.${selectedEnvironment}`;
dotenv.config({ path: credentialsFile, override: true });
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

const getCredential = (name: string): string =>
  getRequiredValue(name, credentialsFile);

const users = {
  standard: {
    username: getCredential('STANDARD_USERNAME'),
    password: getCredential('STANDARD_PASSWORD'),
  },
  problem: {
    username: getCredential('PROBLEM_USERNAME'),
    password: getCredential('PROBLEM_PASSWORD'),
  },
  performance: {
    username: getCredential('PERFORMANCE_USERNAME'),
    password: getCredential('PERFORMANCE_PASSWORD'),
  },
  error: {
    username: getCredential('ERROR_USERNAME'),
    password: getCredential('ERROR_PASSWORD'),
  },
  visual: {
    username: getCredential('VISUAL_USERNAME'),
    password: getCredential('VISUAL_PASSWORD'),
  },
  lockedOut: {
    username: getCredential('LOCKED_OUT_USERNAME'),
    password: getCredential('LOCKED_OUT_PASSWORD'),
  },
};

export const env = {
  target: selectedEnvironment,
  baseURL: getRequiredValue('BASE_URL'),
  apiBaseURL: getRequiredValue('API_BASE_URL'),
  users,
};
