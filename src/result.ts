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

import { Monad, Semigroup } from "./algebraic"
import { is } from "./core"

// Result -> Success(A) | Failure(Error)
/**
 * Represents an optional value that may or may not be present.
 *
 * @template T - The type of the contained value.
 */
export class Result<T> implements Monad<T>, Semigroup<T | Error> {
  /**
   * The value contained in the Result.
   */
  constructor(readonly x: T | Error) { }

  /**
   * Creates an Result instance from a value.
   *
   * @param {T | Error} x - The value to wrap in an Result.
   * @returns {Result<T>} An Result instance containing the provided value.
   */
  static of<T>(x: T): Result<T>
  static of(x: Error): Result<Error>
  static of<T>(x?: T) {
    return is(Error, x)
        ? new Result<Error>(x)
        : new Result(x)
  }

  /**
   * Maps over the value contained in the Result.
   *
   * @template U - The type of the value returned by the mapping function.
   * @param {(x: T) => U | Error} fn - The mapping function.
   * @returns {Result<U | Error>} A new Result instance with the mapped value.
   */
  map<U>(fn: (x: T) => U): Result<U>
  map<U>(fn: (x: T) => U) {
    return is(Error, this.x)
      ? this
      : Result.of(fn(this.x))
  }

  /**
   * Applies a function contained in another Result to the value contained in this Result.
   *
   * @template U - The type of the value returned by the applied function.
   * @param {Result<(x: T) => U | undefined | null>} fn - The Result containing the function to apply.
   * @returns {Result<U | undefined>} A new Result instance with the applied value.
   */
  apply<U>(fn: Result<(x: T) => U>): Result<U>
  apply<U>(fn: Result<(x: T) => U>) {
    return is(Error, fn.x)
      ? this
      : this.map(fn.x)
  }

  /**
   * Chains a function that returns an Result to the current Result, flattening the result.
   *
   * @template U - The type of the value returned by the chained function.
   * @param {(value: T) => Result<U | undefined>} fn - The function to chain.
   * @returns {Result<U | undefined>} A new Result instance resulting from chaining the function.
   */
  bind<U>(fn: (value: T) => Result<U>): Result<U>
  bind<U>(fn: (value: T) => Result<U>) {
    return is(Error, this.x)
      ? this
      : fn(this.x)
  }

  /**
   * Concatenates the current Result with another Semigroup, producing a new Result.
   * The behavior of concatenation depends on the type of the value and its Semigroup implementation.
   *
   * @param {T} x - The value to concatenate with the current Result.
   * @returns {Result<T>} A new Result resulting from the concatenation.
   */
  concat<T extends bigint>(x: T): Result<bigint>
  concat<T extends number>(x: T): Result<number>
  concat<T extends string>(x: T): Result<string>
  concat<U, T extends Array<U>>(x: T): Result<T>
  concat(x: T): Result<T>
  concat(x: T) {
    return is(undefined, this.x) || is(null, this.x)
      ? new Result<T>(x)
      : is(BigInt, x)
        ? new Result<bigint>(this.x as bigint + x)
        : is(Number, x)
          ? new Result<number>(this.x as number + x)
          : is(String, x)
            ? new Result<string>(this.x + x)
            : is(Boolean, x)
              ? new Result<boolean>(this.x && x)
              : is(Array, x)
                ? new Result<T[]>([...this.x as T[], ...x as T[]])
                : is(Object, x) || is(Function)
                  ? new Result<T>({ ...this.x, ...x })
                  : new Result(x)
  }

  /**
   * Matches the current Result against patterns for Success and Error cases.
   *
   * @param {{ Some: <R>(x: T) => R, None: <R>() => R }} fns - Object containing functions for Some and None cases.
   * @returns {R} Result of executing the matched function.
   */
  match<R>(fns: {
    Success: (x: T) => R
    Error: (e: Error) => R
  }): R {
    return is(Error, this.x) ? fns.Error(this.x) : fns.Success(this.x);
  }
}
