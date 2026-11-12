
import { env } from './env';

export const users = {
  standard: {
    username: 'standard_user',
    password: env.password,
  },

  problem: {
    username: 'problem_user',
    password: env.password,
  },

  performance: {
    username: 'performance_glitch_user',
    password: env.password,
  },

  error: {
    username: 'error_user',
    password: env.password,
  },

  visual: {
    username: 'visual_user',
    password: env.password,
  },
} as const;

export type UserKey = keyof typeof users;
