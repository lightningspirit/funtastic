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

/**
 * A type representing a pair of values.
 * 
 * @template T - The type of the first value.
 * @template U - The type of the second value.
 */
export type Pair<T, U> = [T, U]

/**
 * A Semigroup is an algebraic structure with a binary associative operation.
 * 
 * @template T - The type of the value contained in the Semigroup.
 */
export interface Semigroup<T> {
  /**
   * The value contained in the Semigroup.
   */
  readonly x: T;

  /**
   * Concatenates the current Semigroup with another Semigroup, producing a new Semigroup.
   * 
   * @param {T} x - The value to concatenate with the current Semigroup.
   * @returns {Semigroup<T>} A new Semigroup resulting from the concatenation.
   */
  concat: (x: T) => Semigroup<T>;
}

/**
 * A Monoid is a Semigroup with an identity element.
 * 
 * @template T - The type of the value contained in the Monoid.
 */
export interface Monoid<T> extends Semigroup<T> {
  /**
   * The identity element of the Monoid.
   */
  readonly empty: T;
}

/**
 * A Functor is a type class that represents a computational context that can be mapped over.
 * 
 * @template T - The type of the value contained in the Functor.
 */
export interface Functor<T> {
  /**
   * Applies a function to the value contained in the Functor, returning a new Functor with the result.
   * 
   * @template U - The type of the value returned by the function.
   * @param {(value: T) => U} fn - The function to apply to the Functor's value.
   * @returns {Functor<U>} A new Functor containing the result of applying the function.
   */
  map<U>(fn: (value: T) => U): Functor<U>;
}

/**
 * An Applicative is a Functor with application, allowing for functions that are also contained in a context to be applied to values in a context.
 * 
 * @template T - The type of the value contained in the Applicative.
 */
export interface Applicative<T> extends Functor<T> {
  /**
   * Applies a function contained in an Applicative to the value contained in the current Applicative.
   * 
   * @template U - The type of the value returned by the function.
   * @param {Applicative<(value: T) => U>} fn - The Applicative containing the function to apply.
   * @returns {Applicative<U>} A new Applicative containing the result of applying the function.
   */
  apply<U>(fn: Applicative<(value: T) => U>): Applicative<U>;
}

/**
 * A Monad is an Applicative with a function for chaining computations.
 * 
 * @template T - The type of the value contained in the Monad.
 */
export interface Monad<T> extends Applicative<T> {
  /**
   * Chains a function that returns a Monad to the current Monad, flattening the result.
   * 
   * @template U - The type of the value contained in the Monad returned by the function.
   * @param {(value: T) => Monad<U>} fn - The function to apply, which returns a Monad.
   * @returns {Monad<U>} A new Monad resulting from applying the function and flattening the result.
   */
  bind<U>(fn: (value: T) => Monad<U>): Monad<U>;
}

/**
 * The Future interface extends the Monad interface, representing a deferred computation that can be called with arguments.
 * 
 * @template T - The type of the value contained in the Defer.
 * @template U - The types of the arguments that the deferred function accepts.
 */
export interface Future<T, A extends unknown[]> extends Functor<T> {
  /**
   * Calls the deferred function with the provided arguments.
   * 
   * @param {...U} args - The arguments to pass to the deferred function.
   * @returns {T} The result of invoking the deferred function with the provided arguments.
   */
  call(...args: A): T;
}

/**
 * 
 */
export const Functor = Symbol('functor')
