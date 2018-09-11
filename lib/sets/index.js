const { reduce } = require('../index')

/**
 * Creates a new Set with unique elements
 * @param {Array}   
 */
const unique = (x) => reduce(x, (s, n => s.includes(n) ? s : [...s, ...n]), [])

/**
 * 
 * @param {Array} x 
 * @returns 
 */
const intersection = (x) => (y) => unique(x.filter(n => -1 !== y.indexOf(n)))

/**
 * 
 * @param {Array} x 
 */
const union = (x) => (y) => unique([...x, ...y])

/**
 * 
 * @param {Array} x 
 */
const subtraction = (x) => (y) => x.filter(n => !y.includes(n))

module.exports = {
  union,
  unique,
  intersection,
  subtraction,
}
