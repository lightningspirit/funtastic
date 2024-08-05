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

import dlv from "dlv"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = { [key: string]: any }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type KeyWithoutDot<T> = T extends `${infer _Prefix}.${infer _Suffix}`
  ? never
  : T
type Get<T extends Obj, K extends string> =
  K extends KeyWithoutDot<K>
  ? T[K]
  : K extends `${infer Prefix}.${infer Suffix}`
  ? Prefix extends keyof T
  ? Get<T[Prefix], Suffix>
  : never
  : never

/**
 * pluck :: K -> T -> T[K]
 * 
 * Creates a function that extracts the value of a specific key from an object.
 * If an object is provided, it immediately returns the value of the specified key from that object.
 * If no object is provided, it returns a function that will extract the value of the key from any object passed to it.
 * 
 * @example
 * // Define a function that extracts the value of the 'name' property
 * const getName = pluck('name');
 * 
 * // Use the function to extract the 'name' property from an object
 * const person = { name: 'Alice', age: 30 };
 * console.log(getName(person)); // Outputs: 'Alice'
 * 
 * @example
 * // Use pluck with both arguments
 * const person = { name: 'Bob', age: 25 };
 * const name = pluck('name', person);
 * console.log(name); // Outputs: 'Bob'
 * 
 * @param {K} k - The key of the property to be extracted. The key must be a valid property of the object type `T`.
 * @param {T} [o] - The object from which to extract the property value. If not provided, a function is returned.
 * @returns {(T extends object ? (o: T) => T[K] : T[K])} - If an object is provided, returns the value of the specified key from that object. 
 * If no object is provided, returns a function that takes an object and returns the value of the specified key from it.
 * 
 * @template T - The type of the object from which the key will be extracted.
 * @template K - The key of the property to be extracted from the object.
 */
export function pluck<T extends object, K extends string>(k: K): (T extends object ? (o: T) => Get<T, K> : Get<T, K>)
export function pluck<T extends object, K extends string>(k: K, o: T): Get<T, K>
export function pluck<T extends object, K extends string>(k: K, o?: T) {
  return (typeof o === 'undefined') ? (o: T): Get<T, K> => dlv(o, k) : dlv(o, k);
}

export const Struct = {
  pluck,
}
