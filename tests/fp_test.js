const fp = require('../lib/index')
const assert = require('assert')

describe('#def()', () => {
  it('should return true if value is defined', () => {
    const defined = 'this is defined'
    assert.equal(fp.def(defined), true)
  })

  it('should return false if value is not defined', () => {
    assert.equal(fp.def(Array.notDefined), false)
  })
})

describe('#is()', () => {
  it('should return true if value is array', () => {
    assert.equal(fp.is([], Array), true)
  })

  it('should return true if value is string', () => {
    assert.equal(fp.is('foo', String), true)
  })

  it('should return true if value is number', () => {
    assert.equal(fp.is(3.141592, Number), true)
  })

  it('should return true if value is object', () => {
    assert.equal(fp.is({}, Object), true)
  })

  it('should return true if value is function', () => {
    assert.equal(fp.is(() => {}, Function), true)
  })
})

describe('#copy()', () => {
  it('should return a new array', () => {
    const list = [1,2,3]
    assert.notStrictEqual(list, fp.copy(list))
  })
})

describe('#head()', () => {
  it('should return first element', () => {
    assert.equal(fp.head([1,2,3]), 1)
    assert.equal(fp.head([]), null)
  })
})

describe('#tail()', () => {
  it('should return all but first element', () => {
    assert.deepEqual(fp.tail([1,2,3]), [2,3])
  })
})

describe('#spreadArg()', () => {
  it('should transform function args into spread one', () => {
    const add = ([x, ...xs]) => fp.def(x) ? parseInt(x + add(xs)) : []
    assert.equal(fp.spreadArg(add)(1,2,3), add([1,2,3]))
  })
})

describe('#partial()', () => {
  it('should transform function args into spread one', () => {
    const add = (x,y) => x + y
    const add5to = fp.partial(add, 5)
    assert.equal(add5to(10), 15)
  })
})

describe('#pluck()', () => {
  it('should pluck property from object of the list', () => {
    const product = {price: 15}
    assert.equal(fp.pluck('price', product), 15)

    const getPrices = fp.partial(fp.pluck, 'price')
    const products = [
      {price: 10},
      {price: 5},
      {price: 1}
    ]
    
    assert.deepEqual(fp.map(products, getPrices), [10,5,1])
    assert.equal(fp.pluck('foo', null), null)
  })
})

describe('#slice()', () => {
  it('should add object in specified index', () => {
    const array = [1,2,4,5]
    assert.deepEqual(fp.slice(array, 2, 3), [1,2,3,4,5])
  })
})

describe('#reduce()', () => {
  it('should apply reduce to list', () => {
    const sum = (memo, x) => memo + x
    assert.equal(fp.reduce([1,2,3], sum, 0), 6)

    const flatten = (memo, x) => memo.concat(x)
    assert.deepEqual(fp.reduce([4,5,6], flatten, [1,2,3]), [1,2,3,4,5,6])
  })
})

describe('#map()', () => {
  it('should apply map', () => {
    const double = x => x * 2
    assert.deepEqual(fp.map([1,2,3], double), [2,4,6])
  })
})

describe('#length()', () => {
  it('should return length of list', () => {
    const array = [1,2,3,4,5]
    assert.equal(fp.length(array), 5)
  })
})

describe('#first()', () => {
  it('should return first three elements', () => {
    const array = [1,2,3,4,5]
    assert.deepEqual(fp.first(array, 3), [1,2,3])
  })
})

describe('#last()', () => {
  it('should return last three elements', () => {
    const array = [1,2,3,4,5]
    assert.deepEqual(fp.last(array, 3), [3,4,5])
  })
})

describe('#reverse()', () => {
  it('should return reversed list', () => {
    const array = [1,2,3]
    assert.deepEqual(fp.reverse(array), [3,2,1])
  })
})

describe('#reverseArgs()', () => {
  it('should return reversed list', () => {
    const divide = (x,y) => x / y
    assert.equal(divide(100,10), 10)

    const reverseDivide = fp.reverseArgs(divide)
    assert.equal(reverseDivide(100,10), 0.1)
  })
})

describe('#reduceRight()', () => {
  it('should return reversed list', () => {
    const flatten = (memo, x) => memo.concat(x)
    const reduced = fp.reduceRight([[0,1], [2,3], [4,5]], flatten, [])
    assert.deepEqual(reduced, [4, 5, 2, 3, 0, 1])
  })
})

describe('#filter()', () => {
  it('should filter list', () => {
    const even = x => x % 2 === 0
    const odd = x => !even(x)
    const array = [1,2,3,4,5]

    assert.deepEqual(fp.filter(array, even), [2,4])
    assert.deepEqual(fp.filter(array, odd), [1,3,5])
    assert.deepEqual(fp.filter(array, () => false), [])
  })
})

describe('#reject()', () => {
  it('should reject some', () => {
    const even = x => x % 2 === 0
    const array = [1,2,3,4,5]

    assert.deepEqual(fp.reject(array, even), [1,3,5])
  })
})

describe('#partition()', () => {
  it('should reject some', () => {
    const even = x => x % 2 === 0
    const array = [0,1,2,3,4,5]

    assert.deepEqual(fp.partition(array, even), [[0,2,4], [1,3,5]])
  })
})

describe('#swap()', () => {
  it('should swap elements', () => {
    const array = [1,2,3,4,5]

    assert.deepEqual(fp.swap(array, 0, 4), [5,2,3,4,1])
  })
})

describe('#merge()', () => {
  it('should merge lists', () => {
    assert.deepEqual(fp.merge([1,2,3],[4,5,6]), [1,2,3,4,5,6])
  })
})

describe('#flatten()', () => {
  it('should flatten lists', () => {
    assert.deepEqual(fp.flatten([1,[2,3,[4,[5,[[6]]]]]]), [1,2,3,4,5,6])
  })
})

describe('#flow()', () => {
  it('should flow functions', () => {
    const getPrice = fp.partial(fp.pluck, 'price')
    const discount = x => x * 0.9
    const tax = x => x + (x * 0.075)

    const getFinalPrice = fp.flow(getPrice, discount, tax)

    const products = [
      {price: 10},
      {price: 5},
      {price: 1}
    ]

    assert.deepEqual(fp.map(products, getFinalPrice), [9.675, 4.8375, 0.9675])
  })
})

describe('#compose()', () => {
  it('should compose functions', () => {
    const getPrice = fp.partial(fp.pluck, 'price')
    const discount = x => x * 0.9
    const tax = x => x + (x * 0.075)

    const getFinalPrice = fp.compose(tax, discount, getPrice)

    const products = [
      {price: 10},
      {price: 5},
      {price: 1}
    ]

    assert.deepEqual(fp.map(products, getFinalPrice), [9.675, 4.8375, 0.9675])
  })
})
