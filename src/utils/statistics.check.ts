// Run: npx tsx src/utils/statistics.check.ts
import assert from 'node:assert/strict';
import { summarize, pearson } from './statistics';

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

assert.equal(pearson([1, 2, 3], [2, 4, 6]), 1);
assert.equal(pearson([1, 2, 3], [3, 2, 1]), -1);
assert.ok(Math.abs(pearson([1, 0, 1, 0], [0.9, 0.2, 0.7, 0.4]) - 0.9285) < 0.001); // 0.5 / sqrt(0.29)
assert.ok(Number.isNaN(pearson([1, 1, 1], [1, 2, 3])));  // no variance
assert.ok(Number.isNaN(pearson([1, 2], [1, 2])));        // too few pairs

console.log('statistics.check: ok');
