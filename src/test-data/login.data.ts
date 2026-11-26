
import { randomUUID } from 'node:crypto';
import { users } from '../config/users';

// Valid login test data
export const validLoginUsers = [
  {
    name: 'Standard User',
    username: users.standard.username,
    password: users.standard.password,
  },
  {
    name: 'Problem User',
    username: users.problem.username,
    password: users.problem.password,
  },
  {
    name: 'Error User',
    username: users.error.username,
    password: users.error.password,
  },
  {
    name: 'Visual User',
    username: users.visual.username,
    password: users.visual.password,
  },
];

// Invalid login test data
export const invalidLoginUsers = [
  {
    name: 'Invalid username',
    username: `invalid-${randomUUID()}`,
    password: users.standard.password,
    expectedError: 'Username and password do not match',
  },
  {
    name: 'Invalid password',
    username: users.standard.username,
    password: randomUUID(),
    expectedError: 'Username and password do not match',
  },
  {
    name: 'Locked out user',
    username: users.lockedOut.username,
    password: users.lockedOut.password,
    expectedError: 'Sorry, this user has been locked out',
  },
];
