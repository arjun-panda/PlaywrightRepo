// import 'dotenv/config';
// import 'dotenv/config' and dotenv.config() achieve the exact same result—loading variables from your .env file into process.env—using default settings.
// Node.js provides process.env to access environment variables.
import dotenv from 'dotenv';

dotenv.config({ override: true });

console.log('Loaded SauceDemo username:', process.env.USERNAME);

export const env = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

  username: process.env.USERNAME || 'standard_user',

  password: process.env.PASSWORD || 'secret_sauce',

  apiBaseURL:
    process.env.API_BASE_URL ||
    'https://jsonplaceholder.typicode.com',
};
