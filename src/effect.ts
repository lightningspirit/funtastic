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

import { Future } from "./algebraic";
import { is } from "./core";

/**
 * Represents a computation that can be mapped over.
 *
 * @template T The type of the value that the effect holds.
 * @template A The type of the arguments that the effect's function takes.
 */
export class Effect<T, A extends unknown[]> implements Future<T | Promise<T>, A> {
  private constructor(private fn: (...args: A) => T | Promise<T>) { }

  /**
   * Creates a new Effect instance from a given function.
   *
   * @template T The type of the value that the effect holds.
   * @template A The type of the arguments that the effect's function takes.
   * @param {(...args: A) => T | Promise<T>} fn The function to wrap in an Effect.
   * @returns {Effect<T, A>} A new Effect instance.
   * @example
   * const effect = Effect.of((x: number) => x * 2);
   */
  static of<T, A extends unknown[]>(fn: (...args: A) => T | Promise<T>): Effect<T, A> {
    return new Effect(fn);
  }

  /**
   * Transforms the value inside the Effect using a given function.
   *
   * @template U The type of the value after the mapping function is applied.
   * @param {(value: T) => U} fn The function to apply to the value inside the Effect.
   * @returns {Effect<U, A>} A new Effect instance with the transformed value.
   * @example
   * const effect = Effect.of((x: number) => x * 2);
   * const mappedEffect = effect.map(x => x + 1);
   * mappedEffect.call(3).then(console.log); // Output: 7
   */
  map<U>(fn: (value: T) => U): Effect<U, A> {
    return new Effect((...args: A) => {
      const y = this.fn(...args)
      return is(Promise, y)
        ? (y as Promise<T>).then(fn)
        : fn(y)
    })
  }

  /**
   * Calls the effect's function with the given arguments.
   *
   * @param {...A} args The arguments to pass to the effect's function.
   * @returns {T | Promise<T>} The result of the function call.
   * @example
   * const effect = Effect.of((x: number, y: number) => x + y);
   * console.log(effect.call(2, 3)); // Output: 5
   */
  call(...args: A): T | Promise<T> {
    return this.fn(...args);
  }
}
