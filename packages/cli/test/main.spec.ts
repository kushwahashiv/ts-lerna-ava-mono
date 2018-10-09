import test from 'ava';
import { cli } from '../index';

test('test', async t => {
  const actual = await cli();
  t.true(actual);
});
