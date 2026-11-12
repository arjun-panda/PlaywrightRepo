import 'dotenv/config';
// import 'dotenv/config' and dotenv.config() achieve the exact same result—loading variables from your .env file into process.env—using default settings.
// Node.js provides process.env to access environment variables.

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  baseURL: required('BASE_URL', 'https://www.saucedemo.com'),
  username: required('UI_USERNAME', 'standard_user'),
  password: required('UI_PASSWORD', 'secret_sauce'),
  apiBaseURL: required('API_BASE_URL', 'https://jsonplaceholder.typicode.com'),
};
