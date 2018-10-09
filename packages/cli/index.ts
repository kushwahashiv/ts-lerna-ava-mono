import { awesomeFn } from '@caroljs/core';

export function cli(): Promise<boolean> {
  awesomeFn();
  return Promise.resolve(true);
}
