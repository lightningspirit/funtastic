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

import { Pair } from "./algebraic"
import { compose, empty, not } from "./core"

/**
 * List.head :: [x, ...xs] -> x
 * 
 * Returns the first element of an array.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {T[]} arr - The array to extract the first element from.
 * @returns {T} The first element of the array.
 * 
 * @example
 * console.log(head([1, 2, 3])); // Output: 1
 */
const head = <T>([x]: T[]): T => x

/**
 * List.tail :: [x, ...xs] -> xs
 * 
 * Returns all elements of an array except the first one.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {T[]} arr - The array to extract all but the first element from.
 * @returns {T[]} The array without the first element.
 * 
 * @example
 * console.log(tail([1, 2, 3])); // Output: [2, 3]
 */
const tail = <T>([, ...xs]: T[]): T[] => xs

/**
 * List.slice :: x -> y -> xs -> xs
 * 
 * Returns a slice of an array from the start index to the end index.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {number} x - The starting index of the slice.
 * @param {number} [y] - The ending index of the slice (exclusive).
 * @returns {T[]} A function that takes an array and returns the sliced portion.
 * 
 * @example
 * const sliceFrom1To3 = slice(1, 3);
 * console.log(sliceFrom1To3([1, 2, 3, 4])); // Output: [2, 3]
 */
function slice<T>(x: number, y: number, xs: T[]): T[]
function slice<T>(x: number, y: number): (xs: T[]) => T[]
function slice<T>(x: number): (xs: T[]) => T[]
function slice<T>(x: number, y?: number, xs?: T[]) {
  const fn = (xs: T[]) => xs.slice(x, y)
  return typeof xs === 'undefined' ? fn : fn(xs)
}

/**
 * List.size :: xs -> number
 * 
 * Returns the length of an array.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {T[]} xs - The array to calculate the length of.
 * @returns {number} The length of the array.
 * 
 * @example
 * console.log(size([1, 2, 3])); // Output: 3
 */
const size = <T>(xs: T[]): number => xs.length;

/**
 * List.reverse :: [x, ...xs] -> [...xs, x]
 * 
 * Returns a new array that is the reverse of the input array.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {T[]} xs - The array to reverse.
 * @returns {T[]} A new array that is the reverse of the input array.
 * 
 * @example
 * console.log(reverse([1, 2, 3])); // Output: [3, 2, 1]
 */
const reverse = <T>(xs: T[]): T[] => [...xs].reverse()

/**
 * List.filter :: fn -> xs -> xs
 * 
 * Filters an array based on a predicate function.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {(x: T, i: number) => boolean} fn - The predicate function to test each element.
 * @param {T[]} xs - The array to filter.
 * @returns {T[]} A new array with elements that pass the test implemented by the provided function.
 * 
 * @example
 * const isEven = (x: number) => x % 2 === 0;
 * console.log(filter(isEven, [1, 2, 3, 4])); // Output: [2, 4]
 */
function filter<T>(fn: (x: T, i: number) => boolean): (xs: T[]) => T[]
function filter<T>(fn: (x: T, i: number) => boolean, xs: T[]): T[]
function filter<T>(fn: (x: T, i: number) => boolean, xs?: T[]) {
  const ap = (xs: T[]) => xs.filter(fn)
  return typeof xs === 'undefined' ? ap : ap(xs)
}

/**
 * List.reject :: fn -> xs -> xs
 * 
 * Filters out elements from an array that satisfy the predicate function.
 *
 * @param {Function} fn - A function that determines whether an element should be excluded.
 * @param {T[]} xs - An array to be filtered.
 * @returns {T[]} A new array with the elements that do not satisfy the predicate.
 *
 * @template T - The type of elements in the array.
 *
 * @example
 * const result = reject(x => x > 2, [1, 2, 3, 4]);
 * console.log(result); // [1, 2]
 */
function reject<T>(fn: (x: T, i: number) => boolean): (xs: T[]) => T[]
function reject<T>(fn: (x: T, i: number) => boolean, xs: T[]): T[]
function reject<T>(fn: (x: T, i: number) => boolean, xs?: T[]) {
  const ap = (xs: T[]) => xs.reduce<T[]>((xs, x, i) => fn(x, i) ? xs : [...xs, x], [])
  return typeof xs === 'undefined' ? ap : ap(xs)
}

/**
 * List.partition :: fn -> xs -> [xs, ...xs]
 * 
 * Partitions an array into multiple arrays based on the result of the predicate function.
 * 
 * @template T - The type of the elements in the array.
 * 
 * @param {(x: T, i: number) => number | boolean} fn - The predicate function that determines the partition index for each element. 
 * If the function returns `true`, the element goes into the first partition (index 0).
 * If it returns `false`, the element goes into the second partition (index 1).
 * If it returns a number, the element goes into the partition at that index.
 * @param {T[]} xs - The array to partition.
 * @returns {T[][]} An array of arrays, where each inner array is a partition of the original array.
 * 
 * @example
 * // Example with boolean predicate
 * const isEven = (x: number) => x % 2 === 0;
 * console.log(partition(isEven, [1, 2, 3, 4])); // Output: [[2, 4], [1, 3]]
 * 
 * @example
 * // Example with numeric predicate
 * const mod3 = (x: number) => x % 3;
 * console.log(partition(mod3, [1, 2, 3, 4, 5, 6])); // Output: [[3, 6], [1, 4], [2, 5]]
 */
function partition<T>(fn: (x: T, i: number) => number | boolean): (xs: T[]) => T[]
function partition<T>(fn: (x: T, i: number) => number | boolean, xs: T[]): T[]
function partition<T>(fn: (x: T, i: number) => number | boolean, xs?: T[]) {
  const ap = (xs: T[]) => xs.reduce<T[][]>((xss, x, i) => {
    const r = fn(x, i)
    const j = r === true ? 0 : r === false ? 1 : r
    xss[j] = [...xss[j] || [], x]
    return xss
  }, [])
  return typeof xs === 'undefined' ? ap : ap(xs)
}

/**
 * List.compact :: xs -> xs
 * 
 * Removes empty elements from an array.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {T[]} xs - The array to compact.
 * @returns {T[]} A new array with all non-empty elements.
 * 
 * @example
 * console.log(compact([0, 1, false, 2, '', 3])); // Output: [1, 2, 3]
 */
const compact = <T>(xs: T[]): T[] => xs.filter(compose(not, empty))

/**
 * List.map :: fn -> xs -> xs
 * 
 * Creates a new array populated with the results of calling a provided function on every element in the calling array.
 *
 * @template T - The type of the elements in the input array.
 * @template U - The type of the elements in the output array.
 * 
 * @param {(x: T, i: number) => U} fn - The function to call on each element.
 * @param {T[]} xs - The array to map.
 * @returns {U[]} A new array with each element being the result of the callback function.
 * 
 * @example
 * const double = (x: number) => x * 2;
 * console.log(map(double, [1, 2, 3])); // Output: [2, 4, 6]
 */
function map<T, U>(fn: (x: T, i: number) => U): (xs: T[]) => T[]
function map<T, U>(fn: (x: T, i: number) => U, xs: T[]): T[]
function map<T, U>(fn: (x: T, i: number) => U, xs?: T[]) {
  const ap = (xs: T[]) => xs.map(fn)
  return typeof xs === 'undefined' ? ap : ap(xs)
}

/**
 * List.toPairs :: [x, y, ...xs] -> [[x, y], ...]
 * 
 * Converts an array into an array of pairs.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {T[]} xs - The array to convert to pairs.
 * @returns {Pair<T, T>[]} A new array of pairs.
 * 
 * @example
 * console.log(toPairs([1, 2, 3, 4])); // Output: [[1, 2], [3, 4]]
 * console.log(toPairs(['a', 'b', 'c', 'd'])); // Output: [['a', 'b'], ['c', 'd']]
 */
const toPairs = <T>(xs: T[]): Pair<T, T>[] => xs.reduce((xxs, it, i) => (i % 2 === 0 ? [...xxs, [it, xs[i + 1]]] : xxs), [] as Pair<T, T>[]);

/**
 * List.reduceRight :: fn -> x -> [x, ...xs] -> [x]
 * List.reduceRight :: fn -> [x, ...xs] -> [x]
 * 
 * Reduces an array or a value to a single value using a reducer function.
 *
 * - If `it` is an array, reduces the array with the function `fn` and returns a result of type `U`.
 * - If `it` is an initial value, reduces the array `xs` using `fn` and starts with the initial value `it`.
 *
 * @param {(x: T) => T} fn - The reducer function to apply (when `it` is an array).
 * @param {T[]} xs - The array to be reduced (when `it` is an array).
 * @returns {T} The result of the reduction (when `it` is an array).
 * 
 * @param {(x: T) => U} fn - The reducer function to apply (when `it` is an initial value).
 * @param {U} it - The initial value to start reduction (when `it` is an initial value).
 * @param {T[]} xs - The array to be reduced (when `it` is an initial value).
 * @returns {U} The result of the reduction (when `it` is an initial value).
 * 
 * @param {(x: T) => U} fn - The reducer function to apply (when `it` can be an array or initial value).
 * @param {U | T[]} it - Either the initial value or the array to be reduced.
 * @param {T[]} xs - The array to be reduced (when `it` is an initial value).
 * @returns {U | T} The result of the reduction based on whether `it` is an array or an initial value.
 * 
 * @example
 * // Reducing an array with a function that transforms values
 * const sum = reduce((x: number) => x + 1, [1, 2, 3]); // Output: 6
 * 
 * // Reducing an array with an initial value
 * const sumWithInitial = reduce((acc: number, x: number) => acc + x, 0, [1, 2, 3]); // Output: 6
 * 
 * // Reducing an array with a function and an initial value
 * const concatenated = reduce((x: string) => x.toUpperCase(), 'default', ['a', 'b', 'c']); // Output: 'DEFAULT'
 */
function reduce<T, U>(fn: (a: U, x: T) => U, it: U): (xs: T[]) => U;
function reduce<T, U>(fn: (a: U, x: T) => U, it: U, xs: T[]): U;
function reduce<T, U>(fn: (a: U | T[], x: T) => U, it: U, xs?: T[]) {
  const ap = (xs: T[]) => xs.reduce(fn as (acc: U, x: T) => U, it as U)
  return typeof xs === 'undefined' ? ap : ap(xs)
}

/**
 * Sorts an array based on a comparator function.
 *
 * @template T - The type of the elements in the array.
 * 
 * @param {(a: T, b: T) => number} fn - The comparator function.
 * @param {T[]} xs - The array to sort.
 * @returns {T[]} A new array with the elements sorted.
 * 
 * @example
 * const compareNumbers = (a: number, b: number) => a - b;
 * console.log(sort(compareNumbers, [3, 1, 4, 1, 5, 9])); // Output: [1, 1, 3, 4, 5, 9]
 */
function sort<T>(fn: (a: T, b: T) => number): (xs: T[]) => T[];
function sort<T>(fn: (a: T, b: T) => number, xs: T[]): T[];
function sort<T>(fn: (a: T, b: T) => number, xs?: T[]) {
  const ap = (xs: T[]) => [...xs].sort(fn)
  return typeof xs === 'undefined' ? ap : ap(xs)
}

/**
 * List.swap :: number -> number -> xs -> xs
 * 
 * Swaps the elements at indices `i` and `j` in the given array.
 *
 * This function creates a new array with the elements at indices `i` and `j` swapped. The original array remains unchanged.
 *
 * @param {number} i - The index of the first element to swap.
 * @param {number} j - The index of the second element to swap.
 * @param {T[]} xs - The array in which the elements will be swapped.
 * @returns {T[]} A new array with the elements at indices `i` and `j` swapped.
 *
 * @example
 * // Swapping elements at indices 1 and 2
 * const result = swap(1, 2, [1, 2, 3]); // Output: [1, 3, 2]
 */
function swap<T>(i: number, j: number): (xs: T[]) => T[];
function swap<T>(i: number, j: number, xs: T[]): T[];
function swap<T>(i: number, j: number, xs?: T[]) {
  const ap = (xs: T[]) => [...xs].map((x, k) => i === k ? xs[j] : j === k ? xs[i] : x)
  return typeof xs === 'undefined' ? ap : ap(xs)
} 

/**
 * List.parts :: boolean[] -> [x, y, ...xs] -> [x, ...]
 * 
 * Creates an array consisting of the elements from `xs` at positions where `p` has a truthy value.
 *
 * This function filters the elements of `xs` based on the corresponding boolean values in `p`. 
 * If `p` is longer than `xs`, only the first `xs.length` elements of `p` are used.
 *
 * @param {(0 | 1 | true | false)[]} p - An array of boolean-like values indicating which elements to include.
 * @param {T[]} xs - The array from which elements are selected based on `p`.
 * @returns {T[]} A new array containing the elements from `xs` where the corresponding `p` value is truthy.
 *
 * @example
 * // Selecting elements at indices where `p` is truthy
 * const result = parts([true, false, true], ['a', 'b', 'c']); // Output: ['a', 'c']
 * 
 * // If `p` is longer than `xs`, only use the length of `xs`
 * const result2 = parts([true, true, true, false], ['x', 'y']); // Output: ['x', 'y']
 */
function parts<T>(p: (0 | 1 | true | false)[]): (xs: T[]) => T[];
function parts<T>(p: (0 | 1 | true | false)[], xs: T[]): T[];
function parts<T>(p: (0 | 1 | true | false)[], xs?: T[]) {
  const ap = (xs: T[]) => (p.length > xs.length ? p.slice(0, xs.length) : p).reduce<T[]>((xxs, b, i) => b ? [...xxs, xs[i]] : xxs, [])
  return typeof xs === 'undefined' ? ap : ap(xs)
}

/**
 * Flattens an array of arrays into a single array.
 *
 * This function takes an array where each element is either a single value or an array, 
 * and returns a new array with all nested arrays flattened into a single array.
 *
 * @param {(T | T[])[]} xs - An array of elements, each of which is either a value or an array of values.
 * @returns {T[]} A new array containing all elements from `xs`, with nested arrays flattened.
 *
 * @example
 * // Flattening an array of arrays
 * const result = flatten([[1, 2], [3, 4], [5]]); // Output: [1, 2, 3, 4, 5]
 * 
 * // Flattening with single values included
 * const result2 = flatten([1, [2, 3], 4]); // Output: [1, 2, 3, 4]
 */
const flatten = <T>(xs: (T | T[])[]): T[] => xs.flat(1) as T[]

// export as object
export const List = {
  head,
  tail,
  size,
  slice,
  reduce,
  reverse,
  filter,
  reject,
  partition,
  map,
  sort,
  swap,
  parts,
  compact,
  toPairs,
  flatten,
}
