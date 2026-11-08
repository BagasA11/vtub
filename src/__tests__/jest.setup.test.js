import { describe, expect, test } from '@jest/globals';

describe('Jest setup', () => {
  test('runs ES module tests', () => {
    expect(1 + 1).toBe(2);
  });
});
