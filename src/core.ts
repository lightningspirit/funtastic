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

import { Functor } from "./algebraic";
import { Optional } from "./optional";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 
 */
export type Fn = (...args: any[]) => any;

/**
 * 
 */
type RequiredFirstParam<Func extends Fn> = Parameters<Func> extends [
  infer Head,
  ...infer Tail
]
  ? [Head, ...Partial<Tail>]
  : [];

/**
 * 
 */
type RemainingParameters<
  AppliedParams extends any[],
  ExpectedParams extends any[]
> = AppliedParams extends [any, ...infer ATail]
  ? ExpectedParams extends [any, ...infer ETail]
  ? RemainingParameters<ATail, ETail>
  : []
  : ExpectedParams;

/**
 * Recursively defines a curried function type.
 *
 * The `CurriedFunction` type takes a tuple of parameter types `Params` and a return type `Return`.
 * It recursively creates a function type that takes the first parameter in `Params` and returns
 * another function that takes the remaining parameters, until all parameters have been provided,
 * at which point it returns the final return type `Return`.
 *
 * @template Params - A tuple of parameter types for the function.
 * @template Return - The return type of the function.
 * 
 * @see https://medium.com/@patrick.trasborg/creating-a-type-safe-curry-function-with-typescript-3eeb29b5457d
 * Thanks to Patrick's article. After a lot of time trying to have typings correctly.
 * 
 * @copyright @patrick.trasborg
 * 
 * @example
 * // For a function with the signature (a: string, b: number) => boolean,
 * // CurriedFunction<[string, number], boolean> would produce the type:
 * // (arg: string) => (arg: number) => boolean
 * 
 * @example
 * // For a function with the signature (a: number, b: number, c: number) => number,
 * // CurriedFunction<[number, number, number], number> would produce the type:
 * // (arg: number) => (arg: number) => (arg: number) => number
 */
type CurriedFunction<Func extends Fn> = <
  AppliedParams extends RequiredFirstParam<Func>
>(
  ...args: AppliedParams
) => RemainingParameters<AppliedParams, Parameters<Func>> extends [
  any,
  ...any[]
]
  ? CurriedFunction<
    (
      ...args: RemainingParameters<AppliedParams, Parameters<Func>>
    ) => ReturnType<Func>
  >
  : ReturnType<Func>;

/**
 * Extracts the first element type of a tuple.
 * 
 * @template T - The tuple type to extract from.
 * @example
 * // Result is `1`
 * type Result = First<[1, 2, 3]>;
 */
export type Head<T extends any[]> = T extends [infer F, ...any[]] ? F : never;

/**
 * Extracts the tail of a tuple, which is everything except the first element.
 * 
 * @template T - The tuple type to extract the tail from.
 * @example
 * // Result is `[2, 3]`
 * type Result = Tail<[1, 2, 3]>;
 */
export type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

/**
 * Extracts the last element type of a tuple.
 * 
 * @template T - The tuple type to extract from.
 * @example
 * // Result is `3`
 * type Result = End<[1, 2, 3]>;
 */
export type End<T extends any[]> = T extends [...any[], infer L] ? L : never;

/**
 * Define the type for a function that takes a value and returns a boolean.
 * @template T - The type of the input value.
 * @param {T} value - The value to test the predicate against.
 * @returns {boolean} - The result of the predicate test.
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Type alias for composing a series of functions.
 * 
 * @template T - A tuple of functions to be composed.
 * @description This type recursively composes a tuple of functions into a single function type. 
 * The resulting function takes an argument of the type expected by the first function and 
 * returns a value of the type produced by the last function.
 * 
 * @example
 * type Result = ComposeFn<[ 
 *   (x: number) => number, 
 *   (x: number) => string, 
 *   (x: string) => Result<Some<string>> 
 * ]>; // Result is (arg: number) => Result<Some<string>>
 */
export type ComposeFn<T extends any[]> = (
  init: Parameters<End<T>>[0]
) => ReturnType<Head<T>>;

/**
 * identity :: x -> x
 * 
 * The `identity` function is a simple utility that takes a single argument and returns
 * it without any modification. This function is often used as a placeholder or default
 * function when a value needs to be returned unchanged.
 *
 * @param {T} x - The value to be returned unchanged.
 * @returns {T} - The same value that was passed as the argument.
 *
 * @example
 * // Using the identity function
 * const result = identity(42); // result is 42
 *
 * const object = { key: 'value' };
 * const sameObject = identity(object); // sameObject is { key: 'value' }
 */
export const identity = <T = unknown>(x: T): T => x;

/**
 * defined :: x -> boolean
 * 
 * Checks if a variable or value is defined (i.e., not `undefined`).
 *
 * The `defined` function takes a single argument and returns `true` if the argument
 * is not `undefined`. It is useful for checking the presence of a value
 * before performing operations on it, to avoid errors caused by undefined values.
 *
 * @param {unknown} x - The value to be checked for being defined.
 * @returns {boolean} - `true` if the value is not `undefined`, otherwise `false`.
 *
 * @example
 * // Checking if a value is defined
 * const result1 = defined(42); // result1 is true
 * const result2 = defined(undefined); // result2 is false
 * const result3 = defined(null); // result3 is true
 * const result4 = defined(''); // result4 is true
 * const result5 = defined([]); // result5 is true
 * const result6 = defined({}); // result6 is true
 */
export const defined = <T>(x: T): x is T => !(typeof x === 'undefined');

/**
 * declared :: this -> x -> boolean
 *
 * Checks if a property is declared on the current context (`this`) object.
 *
 * This function evaluates the `this` context where it is called. If the `this` context
 * is the `declared` function itself, it defaults to using the global context (`globalThis`). Otherwise, it checks if the specified property (`x`) is defined on the provided context.
 *
 * @param {string} x - The name of the property to check for in the `this` context.
 * @returns {boolean} `true` if the property `x` is declared on the `this` context, `false` otherwise.
 *
 * @example
 * // Example with `globalThis`
 * console.log(declared.call(globalThis, 'foo')); // Assuming 'foo' is not a global property, this will return false.
 *
 * // Example with a specific object
 * const obj = { foo: 'bar' };
 * const declaredInObj = declared.bind(obj);
 * console.log(declaredInObj('foo'));  // true
 * console.log(declaredInObj('baz'));  // false
 *
 * // Example with `globalThis` as the `this` context (when called directly)
 * // If `foo` is a global property, this will return true.
 * console.log(declared('foo'));  // This is the same as calling declared.call(globalThis, 'foo')
 *
 * // Example with `globalThis` as the `this` context (using `apply`)
 * console.log(declared.apply(globalThis, ['foo']));  // As above, this will return false if 'foo' is not a global property.
 */
export function declared(this: any, x: string): boolean {
  const ctx = this === undefined || this === declared ? globalThis : this
  return !(ctx && typeof ctx[x] === 'undefined');
}

/**
 * curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
 *
 * Returns a curried version of a function.
 *
 * A curried function allows you to call a function with a partial set of arguments,
 * and it will return a new function that takes the remaining arguments. This process
 * continues until all arguments have been provided, at which point the original function
 * is invoked with all the arguments.
 *
 * @param {T} fn - The function to be curried.
 * @returns {CurriedFunction} - A curried version of the input function.
 *
 * @template T - The type of the function to be curried.
 * @template CurriedFunction - The type of the curried function.
 *
 * @example
 * // A function that adds three numbers
 * const add = (a: number, b: number, c: number): number => a + b + c;
 *
 * // Curry the add function
 * const curriedAdd = curry(add);
 *
 * // Call the curried function with partial arguments
 * const add5 = curriedAdd(5);
 * const add5And10 = add5(10);
 * const result = add5And10(15); // result is 30
 */
export const curry = <Fn extends (...args: any[]) => any>(fn: Fn): CurriedFunction<Fn> => {
  return function curried(this: any, ...args: any[]) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return (...next: any[]) => curried.apply(this, [...args, ...next]);
    }
  }
};

/**
 * Negates a boolean value.
 *
 * @param {boolean} x - The boolean value to negate.
 * @returns {boolean} The negated boolean value.
 * 
 * @example
 * console.log(not(true)); // Output: false
 * console.log(not(false)); // Output: true
 */
export const not = (x: boolean): boolean => !x

/**
 * Performs a logical OR operation on two boolean values.
 *
 * @param {boolean} a - The first boolean value.
 * @param {boolean} b - The second boolean value.
 * @returns {boolean} The result of the logical OR operation.
 * 
 * @example
 * console.log(or(true, false)); // Output: true
 * console.log(or(false, false)); // Output: false
 */
export const or = curry((a: boolean, b: boolean): boolean => a || b);

/**
 * Performs a logical XOR (exclusive OR) operation on two boolean values.
 *
 * @param {boolean} a - The first boolean value.
 * @param {boolean} b - The second boolean value.
 * @returns {boolean} The result of the logical XOR operation.
 * 
 * @example
 * console.log(xor(true, false)); // Output: true
 * console.log(xor(true, true)); // Output: false
 */
export const xor = curry((a: boolean, b: boolean): boolean => (a && !b) || (!a && b));

/**
 * Performs a logical AND operation on two boolean values.
 *
 * @param {boolean} a - The first boolean value.
 * @param {boolean} b - The second boolean value.
 * @returns {boolean} The result of the logical AND operation.
 * 
 * @example
 * console.log(and(true, false)); // Output: false
 * console.log(and(true, true)); // Output: true
 */
export const and = curry((a: boolean, b: boolean): boolean => a && b);

/**
 * empty :: x -> boolean
 * 
 * Checks if a value is considered empty.
 *
 * The `empty` function takes a single argument and returns `true` if the argument
 * is considered empty. The criteria for emptiness are:
 * - `null`
 * - `undefined`
 * - An empty string (`''`)
 * - An empty array (`[]`)
 * - An empty object (`{}`)
 * - Any other value returns `false`.
 *
 * @param {unknown} x - The value to check for emptiness.
 * @returns {boolean} - `true` if the value is considered empty, otherwise `false`.
 *
 * @example
 * // Checking if a value is empty
 * const result1 = empty(null); // result1 is true
 * const result2 = empty(undefined); // result2 is true
 * const result3 = empty(''); // result3 is true
 * const result4 = empty([]); // result4 is true
 * const result5 = empty({}); // result5 is true
 * const result6 = empty('hello'); // result6 is false
 * const result7 = empty([1, 2, 3]); // result7 is false
 * const result8 = empty({ key: 'value' }); // result8 is false
 */
export const empty = (x: unknown): boolean =>
  x === null || x === undefined
    || typeof x === 'string' && x === ''
    ? true
    : x instanceof Object
      ? x instanceof Array
        ? x.length === 0
        : x instanceof Map || x instanceof Set
          ? x.size === 0
          // WeakMap and WeakSet cannot be directly checked for emptiness.
          // As they are designed for cases where the size isn't typically needed.
          : x instanceof WeakMap || x instanceof WeakSet || x instanceof Function
            // These are objects with internal state or specific data.
            || x instanceof RegExp || x instanceof Date || x instanceof Error
            ? false
            // For general objects, check if there are no own enumerable properties
            : Object.keys(x).length === 0
      : false;

/**
 * is :: t -> x -> boolean
 * 
 * Determines if a value matches a specified type, is an instance of a constructor, strictly equal to any other value or holds the same reference to an object.
 *
 * The function is curried, allowing partial application of arguments. It checks if the value
 * matches the type or is an instance of the constructor function or class. The supported types 
 * include BigInt, Boolean, Function, Number, Object, Symbol, String, Functor (a.k.a has a 'map' method), Array, undefined, and null. For 
 * other types, it uses the `instanceof` operator.
 *
 * @param {unknown} t - The constructor function, class, or primitive type to check against.
 * @param {unknown} x - The value to check.
 * @returns {boolean} - Returns `true` if `x` matches the type of `t`, otherwise `false`.
 *
 * @example
 * // Using with primitive types
 * is(String, 'hello'); // true
 * is(Number, 123); // true
 * is(Boolean, false); // true
 * is('foo', 'foo'); // true
 * is(42, 42); // true
 *
 * // Using with constructors
 * class MyClass {}
 * const myInstance = new MyClass();
 * is(MyClass, myInstance); // true
 *
 * // Using with curried syntax
 * const isString = is(String);
 * isString('hello'); // true
 * isString(123); // false
 */
export function is<T>(t: ArrayConstructor, x: any): x is T[]
export function is<T>(t: ArrayConstructor): (x: any) => x is T[]
export function is(t: BigIntConstructor, x: any): x is bigint
export function is(t: BigIntConstructor): (x: any) => x is bigint
export function is<T>(t: BooleanConstructor, x: any): x is boolean
export function is<T>(t: BooleanConstructor): (x: any) => x is boolean
export function is<T>(t: ErrorConstructor, x: any): x is Error
export function is<T>(t: ErrorConstructor): (x: any) => x is Error
export function is<T>(t: FunctionConstructor, x: any): x is typeof t
export function is<T>(t: FunctionConstructor): (x: any) => x is typeof t
export function is<T>(t: typeof Functor, x: any): x is Functor<T>
export function is<T>(t: typeof Functor): (x: any) => x is Functor<T>
export function is(t: NumberConstructor, x: any): x is number
export function is(t: NumberConstructor): (x: any) => x is number
export function is<T>(t: ObjectConstructor, x: any): x is object
export function is<T>(t: ObjectConstructor): (x: any) => x is object
export function is<T>(t: PromiseConstructor, x: any): x is Promise<T>
export function is<T>(t: PromiseConstructor): (x: any) => x is Promise<T>
export function is(t: StringConstructor, x: any): x is string
export function is(t: StringConstructor): (x: any) => x is string
export function is(t: SymbolConstructor, x: any): x is symbol
export function is(t: SymbolConstructor): (x: any) => x is symbol
export function is(t: undefined, x: any): x is undefined
export function is(t: undefined): (x: any) => x is undefined
export function is(t: null, x: any): x is null
export function is(t: null): (x: any) => x is null
export function is<T>(t: T, x: any): x is T
export function is<T>(t: T): (x: any) => x is T
export function is<T>(t: T, x?: any) {
  const fn = (x: any) => {
    switch (t) {
      case BigInt: return typeof (x as bigint) === 'bigint'
      case Boolean: return typeof (x) === 'boolean'
      case Function: return typeof (x) === 'function'
      case Number: return typeof (x) === 'number'
      case Object: return typeof (x) === 'object'
      case Symbol: return typeof (x) === 'symbol'
      case String: return typeof (x) === 'string'
      case Functor: return typeof (x) === 'object' && 'map' in x && typeof x.map === 'function'
      case Array: return Array.isArray(x)
      case undefined: return typeof (x) === 'undefined'
      case null: return x === null
      default: {
        return typeof t === 'function' && typeof t.prototype === 'object' && t.prototype.constructor === t
          ? x instanceof t
          : typeof x === typeof t;
      }
    }
  }

  return typeof x === 'undefined' ? fn : fn(x)
}

/**
 * map :: fn -> x -> Functor | Promise
 * 
 * Applies a function to each element in a functor, returning a new functor with the results.
 * 
 * This function is curried, meaning it can be partially applied. It takes a function `fn` that 
 * transforms elements of the functor `x`, and returns a new functor with the transformed elements.
 * 
 * @template T - The type of the values in the original functor.
 * @template U - The type of the values in the resulting functor after applying `fn`.
 * @template F - The type of the functor, which can be an array or a promise.
 * 
 * @param {Function} fn - A function that transforms a value of type `T` into a value of type `U`.
 * @param {F} x - A functor containing values of type `T`. This could be an array, a `Promise`, or any other functor.
 * 
 * @returns {F extends Promise<T> ? Promise<U> : F extends Functor<T> ? Functor<U> : never} 
 * A new functor containing values of type `U`, resulting from applying `fn` to each value in `x`.
 * 
 * @example
 * // Example with an array as a functor
 * const numbers = [1, 2, 3];
 * const increment = (x: number) => x + 1;
 * const incrementedNumbers = map(increment, numbers);
 * console.log(incrementedNumbers); // Output: [2, 3, 4]
 * 
 * @example
 * // Example with a Promise as a functor
 * const promise = Promise.resolve(5);
 * const double = (x: number) => x * 2;
 * const doubledPromise = map(double, promise);
 * doubledPromise.then(console.log); // Output: 10
 */
export function map<T, U>(fn: (x: T) => U): {
  (x: T[]): U[];
  (x: Promise<T>): Promise<U>;
  (x: Functor<T>): Functor<U>;
  (x: T): Optional<U>;
};
export function map<T, U>(fn: (x: T) => U, x: T[]): U[];
export function map<T, U>(fn: (x: T) => U, x: Functor<T>): Functor<U>;
export function map<T, U>(fn: (x: T) => U, x: Promise<T>): Promise<U>;
export function map<T, U>(fn: (x: T) => U, x: T): Optional<U>;
export function map<T, U>(fn: (x: T) => U, x?: any): any {
  const ap = (x: T | T[] | Promise<T> | Functor<T>) => {
    return is(Array, x) 
      ? x.map(fn)
      : is(Promise, x)
        ? x.then(fn)
        : is<T>(Functor, x)
          ? x.map(fn)
          : Optional.of(x).map(fn)
  }

  return typeof x === 'undefined' ? ap : ap(x)
}

/**
 * compose :: (...fn) -> fn
 * 
 * Composes a series of functions into a single function.
 * 
 * This function takes a series of functions and returns a new function that, when called, 
 * applies the functions from right to left in sequence to a given argument.
 * 
 * Each function consumes the return value of the function that came before it.
 * The result of the composition is a new function that takes an initial value and applies
 * the composed functions to it in sequence.
 * 
 * @important
 * Evaluation is done from right to left.
 * 
 * @template T - A tuple type representing a list of functions to be composed.
 * @param {...T} fns - The functions to be composed, provided in right-to-left order.
 * @returns {ComposeFn<T>} A new function that represents the composition of the provided functions.
 * 
 * @example
 * // Define some example functions
 * const add5 = (x: number): number => x + 5;
 * const toString = (x: number): string => x.toString();
 * const exclaim = (x: string): string => `${x}!`;
 * 
 * // Compose the functions in right-to-left order
 * const composedFunction = compose(exclaim, toString, add5);
 * 
 * // Use the composed function
 * const result = composedFunction(10); // Result is '15!'
 * 
 * @example
 * // Define functions with different types
 * const increment = (x: number): number => x + 1;
 * const stringify = (x: number): string => `Value: ${x}`;
 * const toUpperCase = (x: string): string => x.toUpperCase();
 * 
 * // Compose these functions in right-to-left order
 * const composed = compose(toUpperCase, stringify, increment);
 * 
 * // Use the composed function
 * const finalResult = composed(5); // Result is 'VALUE: 6'
 */
export const compose = <T extends Array<(arg: any) => any>>(
  ...fns: T
): ComposeFn<T> => {
  return ((init: any) =>
    fns.reduceRight((memo: any, fn: (arg: any) => any) => fn.call(null, memo), init)
  ) as ComposeFn<T>;
};

/**
 * Represents a collection of matchers for different types or values.
 * 
 * @template K - The type of the keys used in the matchers (e.g., string, number, symbol).
 * @template U - The return type of the matchers.
 * 
 * @example
 * const matchers: Matchers<string | number, string> = {
 *   'foo': 'is a foo', // Matches the string 'foo'
 *   Array: (x: number[]) => x[0], // Matches arrays and returns the first element
 *   Number: (x: number) => x + 'Number', // Matches numbers and appends 'Number'
 *   _: 'default' // Default case if no other matches
 * };
 */
type Matchers<K extends string | number | symbol, U> = {
  [s in K]: (((value: any) => U) | U);
}

/**
 * match :: Matchers -> x -> U
 * 
 * Creates a matcher function that executes a handler based on the type or value of the input.
 * 
 * @template K - The type of the keys used in the matchers (e.g., string, number, symbol).
 * @template T - The type of the input value to match.
 * @template U - The return type of the matchers.
 * 
 * @param {Matchers<K, U>} b - An object mapping keys to handler functions or values.
 * @returns {(x: T) => U} A function that takes an input of type `T` and returns a value of type `U`.
 * 
 * @example
 * const m = match({
 *   'foo': 'is a foo', // Handles the case where x === 'foo'
 *   Array: (x: number[]) => x[0], // Handles the case where x is an array
 *   String: (x: string) => x + 'String', // Handles the case where x is a string
 *   Number: (x: number) => x + 'Number', // Handles the case where x is a number
 *   _: 'default' // Default case for unmatched types
 * });
 * 
 * console.log(m('foo')); // Output: 'is a foo'
 * console.log(m([1, 2, 3])); // Output: 1 (first element of the array)
 * console.log(m(42)); // Output: '42Number'
 * console.log(m({})); // Output: 'default' (matches default case)
 * 
 * @throws {Error} Throws an error if no match is found and no default case is provided.
 */
export function match<K extends string | number | symbol, T, U>(
  b: Matchers<K, U>,
  x: T,
): U
export function match<K extends string | number | symbol, T, U>(
  b: Matchers<K, U>,
): (x: T) => U
export function match <K extends string | number | symbol, T, U>(
  b: Matchers<K, U>,
  x?: T
) {
  const fn = (x: T): U => {
    for (const k of Object.keys(b)) {
      if (x === k || x && (k === x.constructor.name || (k === 'Functor' && is(Functor, x)) || k === '_')) {
        return typeof b[k] === 'function' ? b[k](x) : b[k]
      }
    }

    throw new Error(`No match for '${x}'`);
  }

  return typeof x === 'undefined' ? fn : fn(x)
};

/**
 * tryCatch :: fn -> fn -> U
 * 
 * A higher-order function that wraps a function with try-catch error handling.
 *
 * @param {Function} fn - The function to be executed. It should be a function that may throw an error.
 * @param {(error: any, ...args: any[]) => any} errorHandler - A function to handle errors. It will receive the error and the original arguments.
 * @returns {Function} A new function that executes `fn` within a try-catch block. If an error occurs, `errorHandler` is called.
 * 
 * @example
 * // A function that may throw an error
 * const divide = (a, b) => {
 *   if (b === 0) {
 *     throw new Error('Division by zero');
 *   }
 *   return a / b;
 * };
 *
 * // Error handler function
 * const handleError = (error, a, b) => {
 *   console.error(`Error dividing ${a} by ${b}: ${error.message}`);
 *   return 0; // Return a default value or handle the error appropriately
 * };
 *
 * // Create a safe divide function with tryCatch
 * const safeDivide = tryCatch(divide, handleError);
 *
 * // Examples
 * console.log(safeDivide(10, 2)); // 5
 * console.log(safeDivide(10, 0)); // Error dividing 10 by 0: Division by zero, 0
 */
export function tryCatch<U, T extends (...args: any[]) => U>(
  fn: T,
  errorHandler: (error: any, ...args: Parameters<T>) => U
): (...args: Parameters<T>) => ReturnType<T> | ReturnType<typeof errorHandler> {
  return (...args: Parameters<T>): ReturnType<T> | ReturnType<typeof errorHandler> => {
    try {
      return fn(...args);
    } catch (error) {
      return errorHandler(error, ...args);
    }
  };
}
