
import { env } from './env';

export const users = env.users;

export type UserKey = keyof typeof users;
