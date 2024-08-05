/*
Copyright (c) 2024 Move Your Digital, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { strict as assert } from 'assert'
import { memoize } from './memoize.js'
import test, { describe } from 'node:test';

describe('memoize', () => {
  // Test for a simple addition function
  const add = (a: number, b: number) => a + b;
  const memoizedAdd = memoize(add);

  test('memoize(add)(1, 2) returns 3', () => {
    assert.equal(memoizedAdd(1, 2), 3);
  });

  test('memoize(add)(1, 2) returns cached result', () => {
    assert.equal(memoizedAdd(1, 2), 3); // Should return cached result
  });

  // Test for a function with complex arguments
  const concat = (str1: string, str2: string) => str1 + str2;
  const memoizedConcat = memoize(concat);

  test('memoize(concat)("Hello", "World") returns "HelloWorld"', () => {
    assert.equal(memoizedConcat('Hello', 'World'), 'HelloWorld');
  });

  test('memoize(concat)("Hello", "World") returns cached result', () => {
    assert.equal(memoizedConcat('Hello', 'World'), 'HelloWorld'); // Should return cached result
  });

  // Test for a function with object arguments
  const greet = (person: { name: string }) => `Hello, ${person.name}!`;
  const memoizedGreet = memoize(greet);

  test('memoize(greet)({ name: "Alice" }) returns "Hello, Alice!"', () => {
    assert.equal(memoizedGreet({ name: 'Alice' }), 'Hello, Alice!');
  });

  test('memoize(greet)({ name: "Alice" }) returns cached result', () => {
    assert.equal(memoizedGreet({ name: 'Alice' }), 'Hello, Alice!'); // Should return cached result
  });

  describe('ensure resuses cached results', () => {
    // Function that returns a new object based on the input
    const createObject = (key: number) => ({ key });

    // Memoize the function
    const memoizedCreateObject = memoize(createObject);

    test('memoize(createObject)(1) returns an object with key 1', () => {
      const result = memoizedCreateObject(1);
      assert.deepEqual(result, { key: 1 });
    });

    test('memoize(createObject)(1) returns the same reference object', () => {
      const result1 = memoizedCreateObject(1);
      const result2 = memoizedCreateObject(1);

      // Check that both references are the same
      assert.strictEqual(result1, result2, 'The cached result should be the same reference');
    });

    test('memoize(createObject)(2) returns a different reference object', () => {
      const result1 = memoizedCreateObject(2);
      const result2 = memoizedCreateObject(2);

      // Check that the result for different arguments is still cached correctly
      assert.strictEqual(result1, result2, 'The cached result for different input should be the same reference');
    });

    test('memoize(createObject)(1) returns different reference objects for different inputs', () => {
      const result1 = memoizedCreateObject(1);
      const result2 = memoizedCreateObject(2);

      // Check that the results for different arguments are different references
      assert.notStrictEqual(result1, result2, 'The result for different inputs should be different references');
    });
  })
});
