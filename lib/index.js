// Reference:
// https://medium.com/dailyjs/functional-js-with-es6-recursive-patterns-b7d0813ef9e3
// Version 0.1.0

/**
 * Return if argument supplied is defined.
 * @param {*} object
 */
const def = x => typeof x !== 'undefined'

/**
 * is?
 * @param {*} object
 * @param {*} type 
 */
const is = (x, t) => {
  switch(t) {
    case Array: return Array.isArray(x)
    case String: return typeof(x) === 'string'
    case Number: return typeof(x) === 'number'
    case Function: return typeof(x) === 'function'
    case Object: return typeof(x) === 'object'
    default: return x instanceof t
  }
}

/**
 * Returns a copy of an array
 * @param {Array} array 
 */
const copy = array => [...array]

/**
 * Return the first item in an array
 * @param {Array} array 
 */
const head = ([x]) => x

/**
 * Return all array but first element
 * @param {Array} array 
 */
const tail = ([, ...xs]) => xs

/**
 * Convert function that takes an array to one that takes multiple arguments.
 * @param {Function} fn 
 */
const spreadArg = (fn) => (...args) => fn(args)

/**
 * Partially apply a function by filling in any number of its arguments.
 * @param {Function} fn 
 * @param {*} args 
 */
const partial = (fn, ...args) => (...newArgs) => fn(...args, ...newArgs)

/**
 * Extract property value from array. Useful when combined with the map function.
 * @param {*} key 
 * @param {*} object 
 */
const pluck = (key, object) => object ? object[key] : null

/**
 * Returns a new array with value inserted at given index.
 * @param {Array} array
 * @param {Number} index
 * @param {*} object
 */
const slice = ([x, ...xs], i, y, curr = 0) => def(x)
  ? curr === i
    ? [y, x, ...slice(xs, i, y, curr + 1)]
    : [x, ...slice(xs, i, y, curr + 1)]
  : []

/**
 * Applies a function against an accumulator and each element in the array 
 * (from left to right) to reduce it to a single value.
 * @param {Array} array 
 * @param {Function} fn 
 * @param {*} memo
 */
const reduce = ([x, ...xs], fn, memo, i = 0) => def(x)
  ? reduce(xs, fn, fn(memo, x, i), i + 1) : memo

/**
 * Creates a new array with the results of calling 
 * a provided function on every element in this array.
 * @param {Array} xs 
 * @param {Function} fn 
 */
const map = (xs, fn) => reduce(xs, (memo, x, i) => [...memo, fn(x, i)], [])

/**
 * Return the length of an array.
 * @param {Array} xs 
 */
const length = xs => reduce(xs, (memo, x) => memo + 1, 0)

/**
 * Returns a new array that contains the first n items of the given array.
 * @param {Array} xs 
 * @param {Number} n 
 */
const first = (xs, n) => reduce(xs, (memo, x, i) => i < n
? [...memo, x] : [...memo], [])

/**
 * Returns a new array that contains the last n items of the given array.
 * @param {Array} xs 
 * @param {Number} n 
 */
const last = (xs, n) => reduce(xs, (memo, x, i) => i >= (length(xs) - n)
  ? [...memo, x] : [...memo], [])

/**
 * Return a reversed array.
 * @param {Array} xs 
 */
const reverse = xs => reduce(xs, (memo, x) => [x, ...memo], [])

/**
 * Reverse function argument order.
 * @param {Function} fn 
 */
const reverseArgs = (fn) => (...args) => fn(...reverse(args))

/**
 * Similar to reduce, but applies the function from right-to-left.
 * @param {Array} array 
 * @param {Function} fn 
 * @param {*} memo
 */
const reduceRight = (xs, fn, memo) => reduce(reverse(xs), fn, memo)

/**
 * Creates a new array with all elements that pass the test 
 * implemented by the provided function.
 * @param {Array} xs 
 * @param {Function} fn 
 */
const filter = (xs, fn) => reduce(xs, (memo, x) => fn(x)
  ? [...memo, x] : [...memo], [])

/**
 * The opposite of filter, returns an array that does not pass the filter function.
 * @param {Array} xs 
 * @param {Function} fn 
 */
const reject = (xs, fn) => reduce(xs, (memo, x) => fn(x)
  ? [...memo] : [...memo, x], [])

/**
 * Splits an array into two arrays. 
 * One whose items pass a filter function and one whose items fail.
 * 
 * @param {Array} xs 
 * @param {Function} fn 
 */
const partition = (xs, fn) => [filter(xs, fn), reject(xs, fn)]

/**
 * Return a new array with 2 items swapped based on their index.
 * @param {Array} array
 * @param {Number} i
 * @param {Number} j 
 */
const swap = (a, i, j) => (
  map(a, (x,y) => {
    if(y === i) return a[j]
    if(y === j) return a[i]
    return x
  })
)

/**
 * Merges two lists into one
 * @param {*} xs... 
 */
const merge = spreadArg(xs => reduce(xs, (memo, x) => [...memo, ...x], []))

/**
 * Combines nested arrays into a single array.
 * @param {*} xs...
 */
const flatten = xs => reduce(xs, (memo, x) => x
  ? is(x, Array) ? [...memo, ...flatten(x)] : [...memo, x] : [], [])


/**
 * Each function consumes the return value of the function that came before.
 * @param {*} args 
 */
const flow = (...args) => init => reduce(args, (memo, fn) => fn(memo), init)

/**
 * The same as flow, but arguments are applied in the reverse order.
 * @param {*} args 
 */
const compose = (...args) => flow(...reverse(args))
  

module.exports = {
  def,
  is,
  copy,
  head,
  tail,
  spreadArg,
  partial,
  pluck,
  slice,
  reduce,
  map,
  length,
  first,
  last,
  reverse,
  reverseArgs,
  reduceRight,
  filter,
  reject,
  partition,
  swap,
  merge,
  flatten,
  flow,
  compose,
}
