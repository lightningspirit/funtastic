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
import { and, compose, curry, declared, defined, empty, identity, is, map, match, not, or, tryCatch, xor } from "./core.js";
import assert from "node:assert";
import { Functor } from "./algebraic.js";
import { Optional } from "./optional.js";

describe('core', () => {
  describe('defined', () => {
    [
      [undefined, false],
      [null, true, 'null'],
      [42, true],
    ].forEach(([value, expected, label]) => {
      test(`defined(${label || value}) is ${expected}`, () => {
        assert.equal(defined(value), expected)
      })
    })
  })

  describe('declared', () => {
    [
      [declared('xpto'), false, 'xpto'],
      [declared('atob'), true, 'atob'],
      [declared.call({ x: 42 }, 'x'), true, "{ x: 42 }, 'x'"],
    ].forEach(([value, expected, label]) => {
      test(`declared(${label || value}) is ${expected}`, () => {
        assert.equal(value, expected)
      })
    })
  })

  describe('not', ({ name }) => {
    [
      [true, false],
      [false, true],
    ].forEach(([value, expected]) => {
      test(`${name}(${value}) === ${expected}`, () => {
        assert.equal(not(value), expected);
      });
    });
  })

  describe('and', ({ name }) => {
    [
      [true, true, true],
      [true, false, false],
      [false, true, false],
      [false, false, false],
    ].forEach(([a, b, expected]) => {
      test(`${name}(${a}, ${b}) === ${expected}`, () => {
        assert.equal(and(a, b), expected);
      });
    });
  })

  describe('xor', ({ name }) => {
    [
      [true, true, false],
      [true, false, true],
      [false, true, true],
      [false, false, false],
    ].forEach(([a, b, expected]) => {
      test(`${name}(${a}, ${b}) === ${expected}`, () => {
        assert.equal(xor(a, b), expected);
      });
    });
  })

  describe('or', ({ name }) => {
    [
      [true, true, true],
      [true, false, true],
      [false, true, true],
      [false, false, false],
    ].forEach(([a, b, expected]) => {
      test(`${name}(${a}, ${b}) === ${expected}`, () => {
        assert.equal(or(a, b), expected);
      });
    });
  })

  describe('empty', () => {
    [
      [null, true, 'null'],
      ['', true, "''"],
      [undefined, true],
      [0, false],
      [Infinity, false],
      [NaN, false],
      ['string', false],
      [' ', false, "' '"],
      [1, false],
      [{}, true, '{}'],
      [[], true, '[]'],
      [false, false],
      [true, false],
      [new Set(), true, 'new Set()'],
      [new Map(), true, 'new Map()'],
      [new Error(), false, 'new Error()'],
      [new Object(), true, 'new Object()'],
      [new Function(), false, 'new Function()'],
    ].forEach(([value, expected, label]) => {
      test(`empty(${label || value}) is ${expected}`, () => {
        assert.equal(empty(value), expected);
      })
    })
  });

  describe('curry', () => {
    const add = (a: number, b: number, c: number): number => a + b + c;
    const defined = (a: number, b: string, c: { foo?: string }): boolean => !!(a && b && c);

    [
      [curry(add)(1, 2, 3), 6, '(add)(1, 2, 3)'],
      [curry(add)(1)(2)(3), 6, '(add)(1)(2)(3)'],
      [curry(add)(1, 2)(3), 6, '(add)(1, 2)(3)'],
      [curry(add)(1)(2, 3), 6, '(add)(1)(2, 3)'],
      [curry(defined)(1, 'bar', {}), true, '(defined)(1, \'bar\', {})'],
    ].forEach(([value, expected, label]) => {
      test(`curry${label} is ${expected}`, () => {
        assert.equal(value, expected);
      })
    })

    test('curry(')
  })

  describe('is', () => {
    [
      ['hello', String, 'String, \'hello\''],
      [123, Number, 'Number, 123'],
      [false, Boolean, 'Boolean, false'],
      ['foo', 'foo', "'foo', 'foo'"],
      [42, 42, '42, 42'],
      [Promise.resolve(42), Promise, 'Promise, Promise.resolve(42)'],
      [Optional.of(42), Functor, 'Functor, Optional.of(42)'],
      [[42], Array, 'Array, [42]'],
      [42n, BigInt, 'BigInt, 42n'],
      [{}, Object, 'Object, {}'],
      [Symbol('hello'), Symbol, 'Symbol, Symbol(\'hello\')'],
      [undefined, undefined, 'undefined, undefined'],
      [null, null, 'null, null'],
    ].forEach(([value, expected, label]) => {
      test(`is(${label || value}) is true`, () => {
        assert(is(expected, value))
      })
    })
  })

  describe('map', () => {
    test.skip('accepts variadic args', () => {
      assert.deepEqual(map((x: number) => x + 1)(Optional.of(42)), Optional.of(43))
      assert.deepEqual(map((x: number) => x + 1, 42), Optional.of(43))
    });

    ([
      [map((x: number) => x + 1, Promise.resolve(42)), Promise.resolve(43)],
      [map((x: number) => x + 1, Optional.of(42)), Optional.of(43)],
      [map((x: number) => x + 1, [42]), [43]],
      [map((x: number) => x + 1, 42), Optional.of(43)],
    ]).forEach(([value, expected]) => {
      test(`map(${JSON.stringify(value)}) === ${JSON.stringify(expected)}`, () => {
        assert.equal(JSON.stringify(value), JSON.stringify(expected))
      })
    });

    ([
      [identity, Promise.resolve(42), Promise, 'Promise.resolve(42)'],
      [identity, Optional.of(42), Functor, 'Optional.of(42)'],
      [identity, [42], Array, '[42]'],
      [identity, {}, Functor, '{}'],
      [identity, 42, Functor],
      [(x: number) => x + 1, Promise.resolve(42), Promise, 'Promise.resolve(42)'],
      [(x: number) => x + 1, Optional.of(42), Functor, 'Optional.of(42)'],
      [(x: number) => x + 1, [42], Array, '[42]'],
      [(x: number) => x + 1, 42, Functor],
    ] as [<T, U>(x: T) => U, unknown, unknown, string][]).forEach(([fn, value, expected, label]) => {
      test(`map(${label || value}) yields correct type`, () => {
        const x = map(fn)(value)
        assert(is(expected, x))
      })
    })
  })

  describe('compose', () => {
    const increment = (x: number): number => x + 1;
    const stringify = (x: number): string => `Value: ${x}`;
    const toUpperCase = (x: string): string => x.toUpperCase();
    [
      [5, 'VALUE: 6', 'toUpperCase, stringify, increment', toUpperCase, stringify, increment],
    ].forEach(([value, expected, label, ...fns]) => {
      test(`compose(${label})(${value}) = ${expected}`, () => {
        // @ts-expect-error not infering!
        const composed = compose(...fns)
        // @ts-expect-error not infering!
        assert.equal(composed(value), expected)
      })
    })
  })

  describe('match', () => {
    test('accepts variadic args', () => {
      assert.equal(match({ _: '42' })(42), '42')
      assert.equal(match({ _: '42' }, 42), '42')
    })

    const m = match({
      'foo': 'is a foo',
      Array: (x: number[]) => x[0],
      String: (x: string) => x + 'String',
      Number: (x: number) => x + 'Number',
      Functor: (x: Functor<number>) => is(Functor, x) + 'Functor',
      // eslint-disable-next-line @typescript-eslint/ban-types
      Function: (x: Function) => x(42),
      _: 'default',
    });

    [
      [42, '42Number'],
      [[42], 42],
      ['42', '42String'],
      [Optional.of(42), 'trueFunctor'],
      ['foo', 'is a foo'],
      [(x: unknown) => 'fn' + x, 'fn42'],
      [42n, 'default', '42n'],
    ].forEach(([value, expected, label]) => {
      test(`match(${String(label || value)}) === ${String(expected)}`, () => {
        assert.equal(m(value), expected)
      })
    })
  })

  describe('tryCatch', () => {
    const divide = (a: number, b: number) => {
      if (b === 0 || a === b && (b === 0 || b === Infinity)) {
        throw new Error('Division leads to indetermination');
      }
      return a / b;
    };

    const zero = () => 0;
    const safeDivide = tryCatch(divide, zero);

    [
      [10, 2, 5],
      [10, 0, 0],
      [Infinity, Infinity, 0],
      [0, 0, 0],
    ].forEach(([a, b, c]) => {
      test(`tryCatch(divide, zero)(${a}, ${b}) === ${c}`, () => {
        assert.strictEqual(safeDivide(a, b), c)
      })
    })
  })
})
