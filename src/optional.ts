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

import { Monad, Semigroup } from "./algebraic";
import { is } from "./core";

/**
 * Represents an optional value that may or may not be present.
 *
 * @template T - The type of the contained value.
 */
export class Optional<T> implements Monad<T>, Semigroup<T> {
  /**
   * The value contained in the Optional.
   */
  constructor(readonly x: T) {}

  /**
   * Creates an Optional instance from a value.
   *
   * @param {T | undefined | null} x - The value to wrap in an Optional.
   * @returns {Optional<T>} An Optional instance containing the provided value.
   */
  static of<T>(x?: T): Optional<T>
  static of<T>(x?: T) {
    return is(undefined, x) || is(null, x)
      ? new Optional<undefined>(undefined)
      : new Optional<T>(x)
  }

  /**
   * Maps over the value contained in the Optional.
   *
   * @template U - The type of the value returned by the mapping function.
   * @param {(x: T) => U | undefined | null} fn - The mapping function.
   * @returns {Optional<U | undefined>} A new Optional instance with the mapped value.
   */
  map<U>(fn: (x: T) => U): Optional<U>
  map<U>(fn: (x: T) => U) {
    const y = fn(this.x)

    return is(undefined, y) || is(null, y)
      ? new Optional<undefined>(undefined)
      : new Optional<U>(y)
  }

  /**
   * Applies a function contained in another Optional to the value contained in this Optional.
   *
   * @template U - The type of the value returned by the applied function.
   * @param {Optional<(x: T) => U | undefined | null>} fn - The Optional containing the function to apply.
   * @returns {Optional<U | undefined>} A new Optional instance with the applied value.
   */
  apply<U>(fn: Optional<(x: T) => U>): Optional<U>
  apply<U>(fn: Optional<(x: T) => U>) {
    return is(undefined, fn.x) || is(null, fn.x)
      ? new Optional<undefined>(undefined)
      : this.map(fn.x)
  }

  /**
   * Chains a function that returns an Optional to the current Optional, flattening the result.
   *
   * @template U - The type of the value returned by the chained function.
   * @param {(value: T) => Optional<U | undefined>} fn - The function to chain.
   * @returns {Optional<U | undefined>} A new Optional instance resulting from chaining the function.
   */
  bind<U>(fn: (value: T) => Optional<U>): Optional<U>
  bind<U>(fn: (value: T) => Optional<U>) {
    const y = fn(this.x).x

    return is(undefined, y) || is(null, y)
      ? new Optional<undefined>(undefined)
      : new Optional<U>(y)
  }

  /**
   * Concatenates the current Optional with another Semigroup, producing a new Optional.
   * The behavior of concatenation depends on the type of the value and its Semigroup implementation.
   *
   * @param {T} x - The value to concatenate with the current Optional.
   * @returns {Optional<T>} A new Optional resulting from the concatenation.
   */
  concat<T extends bigint>(x: T): Optional<bigint>
  concat<T extends number>(x: T): Optional<number>
  concat<T extends string>(x: T): Optional<string>
  concat<U, T extends Array<U>>(x: T): Optional<T>
  concat(x: Partial<T>): Optional<T>
  concat(x: T) {
    return is(undefined, this.x) || is(null, this.x)
      ? new Optional<T>(x)
      : is(BigInt, x)
        ? new Optional<bigint>(this.x as bigint + x)
        : is(Number, x)
          ? new Optional<number>(this.x as number + x)
          : is(String, x)
            ? new Optional<string>(this.x + x)
            : is(Boolean, x)
              ? new Optional<boolean>(this.x && x)
              : is(Array, x)
                ? new Optional<T[]>([...this.x as T[], ...x as T[]])
                : is(Object, x) || is(Function)
                  ? new Optional<T>({...this.x, ...x})
                  : new Optional(x)
  }

  /**
   * Matches the current Optional against patterns for Some and None cases.
   *
   * @param {{ Some: <R>(x: T) => R, None: <R>() => R }} fns - Object containing functions for Some and None cases.
   * @returns {R} Result of executing the matched function.
   */
  match<R>(fns: {
    Some: (x: T) => R
    None: () => R
  }): R {
    return is(undefined, this.x) || is(null, this.x) ? fns.None() : fns.Some(this.x);
  }
}
