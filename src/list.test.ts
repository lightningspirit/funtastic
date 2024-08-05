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

import { describe, test } from "node:test";
import assert from "node:assert";
import { List } from "./list";

describe('List', () => {
  describe('List.head', ({ name }) => {
    ([
      [[], undefined],
      [[1, 2, 3], 1],
    ] as [number[], number][]).forEach(([value, expected]) => {
      test(`${name}([${value}]) === ${expected}`, () => {
        assert.strictEqual(List.head(value), expected)
      })
    })
  })

  describe('List.tail', ({ name }) => {
    ([
      [[], []],
      [[1, 2, 3], [2, 3]],
    ] as [number[], number[]][]).forEach(([value, expected]) => {
      test(`${name}([${value}]) === [${expected}]`, () => {
        assert.deepStrictEqual(List.tail(value), expected)
      })
    })
  })

  describe('List.slice', ({ name }) => {
    const sliceFrom1To3 = List.slice(1, 3);

    ([
      [[], []],
      [[1, 2, 3, 4], [2, 3]],
    ] as [number[], number[]][]).forEach(([value, expected]) => {
      test(`${name}(1, 3)([${value}]) === [${expected}]`, () => {
        assert.deepStrictEqual(sliceFrom1To3(value), expected)
      })
    })
  })

  describe('List.size', ({ name }) => {
    ([
      [[], 0],
      [[1, 2, 3, 4], 4],
    ] as [number[], number][]).forEach(([value, expected]) => {
      test(`${name}([${value}]) === ${expected}`, () => {
        assert.deepStrictEqual(List.size(value), expected)
      })
    })
  })

  describe('List.reverse', ({ name }) => {
    ([
      [[], []],
      [[1, 2, 3, 4], [4, 3, 2, 1]],
    ] as [number[], number[]][]).forEach(([value, expected]) => {
      test(`${name}([${value}]) === [${expected}]`, () => {
        assert.deepStrictEqual(List.reverse(value), expected)
      })
    })
  })

  describe('List.filter', ({ name }) => {
    ([
      [[], []],
      [[1, 2, 3, 4], [2, 4]],
    ] as [number[], number[]][]).forEach(([value, expected]) => {
      test(`${name}((x) => x % 2, [${value}]) === [${expected}]`, () => {
        assert.deepStrictEqual(List.filter((x) => x % 2 === 0, value), expected)
      })
    })
  })

  describe('List.reject', ({ name }) => {
    ([
      [[], []],
      [[1, 2, 3, 4], [1, 3], '[1, 3]'],
    ] as [number[], number[]][]).forEach(([value, expected]) => {
      test(`${name}((x) => x % 2, [${value}]) === [${expected}]`, () => {
        assert.deepStrictEqual(List.reject((x) => x % 2 === 0, value), expected)
      })
    })
  })

  describe('List.partition', ({ name }) => {
    ([
      [[], []],
      [[1, 2, 3, 4], [[2, 4], [1, 3]], '[[2, 4], [1, 3]]'],
    ] as [number[], number[][]][]).forEach(([value, expected]) => {
      test(`${name}((x) => x % 2, [${value}]) === [${expected}]`, () => {
        assert.deepStrictEqual(List.partition((x) => x % 2, value), expected)
      })
    })
  })

  describe('List.compact', ({ name }) => {
    ([
      [[], []],
      [[1, 2, undefined, 3, null, false, 4], [1, 2, 3, false, 4]],
    ] as [number[], number[]][]).forEach(([value, expected]) => {
      test(`${name}((x) => x % 2, [${value}]) === [${expected}]`, () => {
        assert.deepStrictEqual(List.compact(value), expected)
      })
    })
  })

  describe('List.map', ({ name }) => {
    ([
      [((x: number, i: number) => x + i), [1, 2, 3], [1, 3, 5]],
      [((x: number, i: number) => `${x}-${i}`), ['a', 'b', 'c'], ['a-0', 'b-1', 'c-2']],
      [((x: number, i: number) => i * 2), [5, 6, 7], [0, 2, 4]],
    ] as [(x: number, i: number) => number, number[], number[]][]).forEach(([fn, xs, expected]) => {
      test(`${name}(fn, [${xs}]) === [${expected}]`, () => {
        assert.deepEqual(List.map(fn, xs), expected);
      });
    });
  })

  describe('List.toPairs', ({ name }) => {
    ([
      [[1, 2, 3, 4, 5, 6], [[1, 2], [3, 4], [5, 6]]],
    ] as [number[], [number, number][]][]).forEach(([xs, expected]) => {
      test(`${name}([${xs}]) === ${JSON.stringify(expected)}`, () => {
        assert.deepEqual(List.toPairs(xs), expected);
      });
    });
  })

  describe('List.reduce', ({ name }) => {
    // Test when `it` is an initial value
    ([
      [((x: number, y: number) => x + y), 0, [1, 2, 3], 6], // Sum of elements with initial value 0
      [((x: number, y: number) => x * y), 1, [1, 2, 3, 4], 24], // Product of elements with initial value 1
      [((x: string, y: string) => x + y), '', ['a', 'b', 'c'], 'abc'], // Concatenate strings with initial value ''
    ] as [(x: number, i: number) => number, number | string, number[], number | string][]).forEach(([fn, it, xs, expected]) => {
      test(`${name}(fn, ${JSON.stringify(it)}, ${JSON.stringify(xs)}) === ${expected}`, () => {
        // @ts-expect-error infering !
        assert.deepEqual(List.reduce(fn, it, xs), expected);
      });
    });
  })

  describe('List.sort', () => {
    // Test sorting with numbers
    [
      [((a: number, b: number) => a - b), [3, 1, 2], [1, 2, 3]], // Ascending order
      [((a: number, b: number) => b - a), [3, 1, 2], [3, 2, 1]], // Descending order
    ].forEach(([fn, xs, expected]) => {
      test(`List.sort(fn, ${JSON.stringify(xs)}) === ${JSON.stringify(expected)}`, () => {
        // @ts-expect-error infering !
        assert.deepEqual(List.sort(fn, xs), expected);
      });
    });

    // Test sorting with strings
    [
      [((a: string, b: string) => a.localeCompare(b)), ['banana', 'apple', 'cherry'], ['apple', 'banana', 'cherry']], // Alphabetical order
      [((a: string, b: string) => b.localeCompare(a)), ['banana', 'apple', 'cherry'], ['cherry', 'banana', 'apple']], // Reverse alphabetical order
    ].forEach(([fn, xs, expected]) => {
      test(`List.sort(fn, ${JSON.stringify(xs)}) === ${JSON.stringify(expected)}`, () => {
        // @ts-expect-error infering !
        assert.deepEqual(List.sort(fn, xs), expected);
      });
    });

    // Test sorting with complex objects
    interface Person {
      name: string;
      age: number;
    }

    const people: Person[] = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 }
    ];

    [
      [((a: Person, b: Person) => a.age - b.age), people, [{ name: 'Bob', age: 25 }, { name: 'Alice', age: 30 }, { name: 'Charlie', age: 35 }]], // Sort by age ascending
      [((a: Person, b: Person) => b.age - a.age), people, [{ name: 'Charlie', age: 35 }, { name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]], // Sort by age descending
      [((a: Person, b: Person) => a.name.localeCompare(b.name)), people, [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }, { name: 'Charlie', age: 35 }]] // Sort by name alphabetical
    ].forEach(([fn, xs, expected]) => {
      test(`List.sort(fn, ${JSON.stringify(xs)}) === ${JSON.stringify(expected)}`, () => {
        // @ts-expect-error infering !
        assert.deepEqual(List.sort(fn, xs), expected);
      });
    });
  })

  describe('List.swap', () => {
    ([
      [0, 1, [1, 2], [2, 1]], // Swap elements 1 and 2
      [1, 2, [1, 2, 3], [1, 3, 2]], // Swap elements 2 and 3
      [0, 2, [1, 2, 3], [3, 2, 1]], // Swap elements 1 and 3
    ] as [number, number, number[], number[]][]).forEach(([i, j, xs, expected]) => {
      test(`List.swap(${i}, ${j}, ${JSON.stringify(xs)}) === ${JSON.stringify(expected)}`, () => {
        assert.deepEqual(List.swap(i, j, xs), expected);
      });
    });
  })

  // Test for `parts`
  describe('List.parts', () => {
    ([
      [[true, false, true], ['a', 'b', 'c'], ['a', 'c']], // Filter 'a' and 'c'
      [[1, 0, 1], ['x', 'y', 'z'], ['x', 'z']], // Filter 'x' and 'z'
      [[true, true, false, true], ['p', 'q', 'r'], ['p', 'q']], // Filter 'p' and 'q'
    ] as [(boolean | 0 | 1)[], string[], string[]][]).forEach(([p, xs, expected]) => {
      test(`List.parts(${JSON.stringify(p)}, ${JSON.stringify(xs)}) === ${JSON.stringify(expected)}`, () => {
        assert.deepEqual(List.parts(p, xs), expected);
      });
    });
  })

  // Test for `flatten`
  describe('List.flatten', () => {
    [
      [[1, [2, 3], 4], [1, 2, 3, 4]], // Flatten a mix of values and arrays
      [[[1, 2], [3, 4], [5]], [1, 2, 3, 4, 5]], // Flatten nested arrays
      [[1, [2, [3, 4]], 5], [1, 2, [3, 4], 5]], // Flatten with deeper nesting
    ].forEach(([xs, expected]) => {
      test(`List.flatten(${JSON.stringify(xs)}) === ${JSON.stringify(expected)}`, () => {
        assert.deepEqual(List.flatten(xs), expected);
      });
    });
  })
})