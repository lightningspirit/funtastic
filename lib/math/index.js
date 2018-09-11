const add = spreadArg(([x, ...xs]) => reduce(xs, (memo, y) => memo + y, x))
const divide = spreadArg(([x, ...xs]) => reduce(xs, (memo, y) => memo / y, x))
const multiply = spreadArg(([x, ...xs]) => reduce(xs, (memo, y) => memo * y, x))
const min = ([x, ...xs], result = Infinity) => def(x)
  ? x < result
      ? min(xs, x)
      : result
  : result
const max = ([x, ...xs], result = -Infinity) => def(x)
  ? x > result
      ? max(xs, x)
      : max(xs, result)
  : result

module.exports = {
  add, divide, multiply, min, max
}
