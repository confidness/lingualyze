// Run: npx tsx src/utils/statistics.check.ts
import assert from 'node:assert/strict';
import { summarize } from './statistics';

const s = summarize([2, 4, 4, 4, 5, 5, 7, 9]);
assert.equal(s.n, 8);
assert.equal(s.mean, 5);
assert.equal(s.median, 4.5);
assert.ok(Math.abs(s.sd - 2.138) < 0.001);          // sample SD (n - 1)
assert.ok(Math.abs(s.ci95 - 2.36 * s.se) < 1e-9);   // t(7) critical value

assert.equal(summarize([3, 1, 2]).median, 2);
assert.equal(summarize([10]).sd, 0);
assert.ok(Number.isNaN(summarize([10]).ci95));
assert.ok(Number.isNaN(summarize([]).mean));

console.log('statistics.check: ok');
